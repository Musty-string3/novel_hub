from django.shortcuts import render, redirect
from datetime import datetime, timedelta, timezone
from django.db import transaction

from rest_framework import status, generics
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .models import *
from .serializers.novel import *
from .serializers.message import *
from .serializers.folder import *


class FoldersView(generics.ListCreateAPIView):
    """
    GET POSTを担当

    ログインユーザーのフォルダの一覧取得
    フォルダの新規作成
    """

    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]

    ## NOTE GET /PATCH / PUT / DELETE の時、クエリセットを加工することが可能
    def get_queryset(self):
        ## ログインユーザーのフォルダ情報のみ返却
        return Folder.objects.filter(user=self.request.user).order_by("-created_at")

    ## NOTE POST（新規作成）時の保存処理をカスタマイズ可能
    def perform_create(self, serializer):
        ## ログインユーザーはフォルダの作成者として設定する
        serializer.save(user=self.request.user)


class FolderUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET PATCH DELETEを担当

    ログインユーザーのフォルダを1件取得取得
    ログインユーザーのフォルダを1件更新
    ログインユーザーのフォルダを1件削除
    """

    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]

    ## GET PATCH DELETEすべてで自分のフォルダしか触れないように制限
    def get_queryset(self):
        return Folder.objects.filter(user=self.request.user)


class NovlesView(generics.CreateAPIView):
    """
    POSTを担当

    小説の新規作成
    """

    serializer_class = NovelSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        ## URLからどのフォルダかを判定する
        id = self.kwargs.get("pk")
        if not id:
            raise ValidationError({"message": "フォルダが見つかりませんでした。"})

        try:
            folder = Folder.objects.get(id=id)
        except Folder.DoesNotExist:
            raise ValidationError({"message": "フォルダが見つかりませんでした。"})

        serializer.save(user=self.request.user, folder=folder)


class NovelUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET PATCH DELETEを担当

    ログインユーザーの小説を1件取得取得
    ログインユーザーの小説を1件更新
    ログインユーザーの小説を1件削除
    """

    serializer_class = NovelDetailSerializer
    permission_classes = [IsAuthenticated]

    ## GET PATCH DELETEすべてで自分のフォルダしか触れないように制限
    def get_queryset(self):
        return Novel.objects.filter(user=self.request.user)


class MessagesView(generics.ListCreateAPIView):
    """
    GET POSTを担当

    小説内のメッセージの一覧を取得
    小説内のメッセージを新規作成
    """

    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        novel_id = self.kwargs.get("pk")
        if not novel_id:
            raise ValidationError({"message": "小説が見つかりませんでした。"})

        return Message.objects.filter(novel=novel_id)

    def perform_create(self, serializer):
        novel_id = self.kwargs.get("pk")

        try:
            novel = Novel.objects.get(id=novel_id)
        except Novel.DoesNotExist:
            raise ValidationError({"message": "小説が見つかりませんでした。"})

        ## 表示順は現在の小説のメッセージ数 + 1に設定する
        order =  Message.objects.filter(novel=novel).count() + 1
        serializer.save(novel=novel, order=order)


class MessagesUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET PATCH DELETEを担当

    特定の小説のメッセージを1件取得、更新、削除
    """

    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        novel_id = self.kwargs.get("novel_pk")
        try:
            novel = Novel.objects.get(id=novel_id)
        except Novel.DoesNotExist:
            raise ValidationError({"message": "小説が見つかりませんでした。"})

        return Message.objects.filter(novel=novel)

    ## NOTE perform_update: 保存処理をカスタマイズしたいとき用
    ## NOTE update: 更新リクエスト全体の流れやレスポンスをカスタマイズしたいとき用
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        target_order = instance.order
        novel = instance.novel
        direction = self.request.data.get("direction_type")

        if direction in ["up", "down"]:
            print("メッセージの上下変更開始")
            max_order = Message.objects.filter(novel=novel).count()

            ## ユーザーが選択したメッセージの上下の表示順を計算
            if (direction == "up" and target_order > 1):
                swap_order = target_order - 1
            elif (direction == "down" and target_order < max_order):
                swap_order = target_order + 1

            ## 上下を変更したことにより、別のメッセージの表示順も切り替える
            try:
                swap_message = Message.objects.get(novel=novel, order=swap_order)
            except Message.DoesNotExist:
                ## 変更される側のメッセージを取得できない場合は何もせずに終了
                return serializer.save()

            ## ユーザーが選択したメッセージと交換するメッセージの入れ替え
            with transaction.atomic():
                ## ユニーク制約でorderが重複することは許されないため、一時的にorderの値を仮で設定する
                swap_message.order = -1
                swap_message.save()

                instance.order = swap_order
                instance.save()

                swap_message.order = target_order
                swap_message.save()

            return Response(status=status.HTTP_204_NO_CONTENT)

        else:
            ## メッセージ内容の変更
            return super().update(request, *args, **kwargs)


    def perform_destroy(self, instance):
        novel = instance.novel
        order_to_delete = instance.order
        instance.delete()

        ## 削除したインスタンスよりも表示順が下のものは1つずつ繰り上げる
        messages = Message.objects.filter(novel=novel, order__gt=order_to_delete).order_by("order")
        for message in messages:
            message.order -= 1
            message.save(update_fields=["order", "updated_at"])
