from rest_framework import serializers

from .models import *
from accounts.serializers import UserSerializer


class NovelSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    # novels = FolderSerializer(, read_only=True)

    class Meta:
        model = Novel
        fields = [
            'id',
            'user',
            # 'folder',
            'title',
            'description',
            'is_public',
            'show_speaker',
            'background_color',
            'view_count',
            'movie_url',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'user',
            'folder',
            'created_at',
        ]


class FolderSerializer(serializers.ModelSerializer):
    ## accounts/からユーザーシリアライザを取得し、ユーザー状態は読み込み専用にする
    user = UserSerializer(read_only=True)

    ## NOTE
    ## many=Trueは複数のnovelを配列で返すように指定
    ## read_only=TrueはAPI経由でFolderを作成、更新する際はnovelのデータを書き込み対象にしない
    novels = NovelSerializer(many=True, read_only=True)

    class Meta:
        model = Folder
        fields = [
            'id',
            'user',
            'name',
            'novels',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'user',
            'created_at',
        ]