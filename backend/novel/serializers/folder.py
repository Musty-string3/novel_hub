from rest_framework import serializers

from ..models import *
from accounts.serializers import UserSerializer
from .message import *


class FolderSerializer(serializers.ModelSerializer):
    ## accounts/からユーザーシリアライザを取得し、ユーザー状態は読み込み専用にする
    user = UserSerializer(read_only=True)

    ## NOTE
    ## many=Trueは複数のnovelを配列で返すように指定
    ## read_only=TrueはAPI経由でFolderを作成、更新する際はnovelのデータを書き込み対象にしない
    def get_novels(self, obj):
        from .novel import NovelSerializer
        novles_qs = obj.novels.all()
        return NovelSerializer(novles_qs, many=True, read_only=True).data

    novels = serializers.SerializerMethodField()

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