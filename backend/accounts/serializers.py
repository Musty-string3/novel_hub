from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import *


class ProfileSerializer(serializers.ModelSerializer):
    """
    プロフィール情報の取得
    """
    class Meta:
        model = Profile
        fields = [
            'id',
            'name',
            'bio',
            'is_public',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'created_at',
        ]


    def validate_name(self, value):
        """ユーザー名は必須 & 50文字以内"""
        name = value.strip()
        if not name:
            raise serializers.ValidationError("ユーザー名は必須項目です")
        if len(name) > 50:
            raise serializers.ValidationError("ユーザー名は50文字以内で入力してください")
        return value

    def validate_bio(self, value):
        """自己紹介は1000文字以内"""
        if len(value) > 1000:
            raise serializers.ValidationError("自己紹介は1000文字以内で入力してください")
        return value


class UserSerializer(serializers.ModelSerializer):
    """
    取得したいユーザーの情報を全て返す
    """

    ## プロフィール情報の取得
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'email_verified',
            'provider',
            'provider_id',
            'theme_preference',
            'last_login',
            'is_active',
            'is_staff',
            'profile',
            'created_at',
            'updated_at',
        ]
        ## NOTE API経由で変更"させたくない"もの（これはDRFが自動でやってくれる）
        read_only_fields = [
            'id',
            'email',
            'email_verified',
            ## ! Googleログインの場合はどうする？
            'provider',
            'provider_id',

            'last_login',
            'is_active',
            'is_staff',
            'created_at',
        ]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    メールアドレスでログインする場合
    """
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        ## 　ユーザー認証の実施
        user = authenticate(
            request = self.context.get("request"),
            email = email,
            password = password
        )

        ## ユーザー情報を取得できないときはエラーメッセージを吐かせる
        if not user:
            raise serializers.ValidationError("メールアドレスまたはパスワードが違います")

        return super().validate(attrs)