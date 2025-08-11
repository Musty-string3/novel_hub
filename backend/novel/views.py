from django.shortcuts import render, redirect
from datetime import datetime, timedelta, timezone

from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .models import *
from .serializers import *


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
