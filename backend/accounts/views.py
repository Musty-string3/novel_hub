import os
import jwt
from django.shortcuts import render, redirect
from django.views import View
from django.http import JsonResponse
from datetime import datetime, timedelta, timezone

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import *
from common.email_manager import signup_verify_email
from .serializers import *


class TopView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "Hello World"})


class SignUpView(APIView):
    def post(self, request, *args, **kwargs):
        """
        メールアドレスとパスワードでのユーザー新規登録

        ここでは仮のユーザー登録を行い、まだログインはできない状態
        VerifyEmailViewでメール認証後に初めてログインができる状態にする
        """

        email = request.data.get("email")
        password = request.data.get("password")

        print(f"email: {email}, password: {password}")

        if not email or not password:
            return Response({
                "message": "メールアドレスとパスワードは必須です。", 
            }, status=status.HTTP_400_BAD_REQUEST)

        ## 既に存在しているメールアドレスでサインアップした時は処理終了
        if User.objects.filter(email=email).exists():
            return Response({
                "message": "このメールアドレスは既に登録されています。", 
            }, status=status.HTTP_400_BAD_REQUEST)

        ## モデルで設定したUserManagerを通すため、create_userを使用する
        try:
            user = User.objects.create_user(email=email, password=password, provider=0, is_active=False)
        except Exception as e:
            print(f"ユーザーの作成に失敗しました。email: {email}, password: {password}, エラー内容: {e}")
            return Response({
                "message": "ユーザーの作成に失敗しました。", 
            }, status=status.HTTP_400_BAD_REQUEST)

        # JWTを発行し、ログイン認証で使用するトークンを作成
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # メール認証で使用するトークンを発行し、トークンの有効期限は60分に設定
        token = jwt.encode(
            {
                "user_id": user.id,
                ## トークンの有効期限を設定変更
                "exp": datetime.now(timezone.utc) + timedelta(minutes=60)
            },
            settings.SECRET_KEY,
            algorithm="HS256"
        )

        # 認証URL作成する（React側のドメインを元にURLを生成する）
        if settings.FRONTEND_URL:
            verify_url = f"{settings.FRONTEND_URL}/accounts/verify_email?token={token}"
        else:
            print(f"FRONTEND_URLが存在しません。")
            print(f"settings.FRONTEND_URL: {settings.FRONTEND_URL}")

        ## メール認証を行うためのメールを送信
        try:
            signup_verify_email(verify_url, email)
        except Exception as e:
            print(f"ユーザー登録でのメール送信に失敗。エラー:{e}")

        return Response(
            {
                "message": "登録されたメールアドレスに認証メールを送信しました。",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "provider": "local",
                    "created_at": user.created_at.strftime("%Y-%m-%d %H:%M"),
                    "updated_at": user.updated_at.strftime("%Y-%m-%d %H:%M"),
                },
                "refresh": str(refresh),
                "access": access_token
            }, status=status.HTTP_201_CREATED
        )


## 新規ユーザー登録のメール認証
class VerifyEmailView(APIView):
    def get(self, request, *args, **kwargs):
        """
        メールアドレスとパスワードでのユーザー新規登録（仮）後のメール認証

        メール認証の有効期間をここで設定している
        メール認証が成功すれば初めてログインができる
        TODO メール認証ができなかったユーザーはその後に同じメールアドレスでログインができなくなるので、対応する必要あり
        """

        token = request.GET.get("token")

        ## トークンが存在しない場合はその場で処理終了
        if not token:
            return Response({"message": "トークンがありません。"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ## トークンをデコード
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")

            user = User.objects.get(id=user_id)
            ## アカウントが有効な場合はリダイレクト
            if user.is_active:
                return Response({"message": "このアカウントはすでに認証済みです。"}, status=status.HTTP_400_BAD_REQUEST)

            user.is_active = True
            user.email_verified = True
            user.last_login = datetime.now()
            user.save(update_fields=["is_active", "email_verified", "last_login", "updated_at"])

            serializer = UserSerializer(user)

            return Response({
                "message": "メールアドレスが認証されました。",
                "user": serializer.data,
                }, status=status.HTTP_200_OK
            )

        ## トークンの有効期限切れの場合
        except jwt.ExpiredSignatureError:
            return Response({"message": "トークンの有効期限が切れています。"}, status=status.HTTP_400_BAD_REQUEST)

        ## トークンが無効な場合
        except jwt.InvalidTokenError:
            return Response({"message": "無効なトークンです。"}, status=status.HTTP_400_BAD_REQUEST)

        ## そもそもユーザーが取得できない場合
        except User.DoesNotExist:
            return Response({"message": "ユーザーが見つかりません。"}, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    メールアドレスとパスワードでのログイン

    本来であればTokenObtainPairViewで足りるが、
    メールアドレスまたはパスワードが間違っていた際のエラーメッセージを出したいためカスタムViewで作成
    """

    print("ログイン実施")
    serializer_class = CustomTokenObtainPairSerializer


class MeView(APIView):
    ## ログインしていない時はアクセスできない
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        ログイン中のユーザー情報を返す
        """

        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        """
        ログインユーザーの情報を書き換える

        ダークモード設定などがありえる
        """
        return


class ProfileView(APIView):
    ## ログインしていない時はアクセスできない
    permission_classes = [IsAuthenticated]

    def _get_profile(self, user):
        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            return False
        return profile

    def get(self, request, *args, **kwargs):
        """
        プロフィール情報の取得
        """

        print(f"request: {request}")
        print(f"request.user: {request.user}")

        profile = self._get_profile(request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def patch(self, request, *args, **kwargs):
        """
        プロフィール情報の変更
        """

        profile = self._get_profile(request.user)
        ## NOTE 第一引数に変更したい対象のインスタンス、第二引数に変更したいデータ、第三引数は渡したフィールドのデータだけ書き換える（Falseなら全て書き換え）
        serializer = ProfileSerializer(profile, request.data, partial=True)
        ## NOTE バリデーションが不正な場合はValidationErrorで400エラーで返す
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)