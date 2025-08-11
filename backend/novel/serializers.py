from rest_framework import serializers

from .models import Folder
from accounts.serializers import UserSerializer

class FolderSerializer(serializers.ModelSerializer):
    ## accounts/からシリアライザを取得
    user = UserSerializer()

    class Meta:
        model = Folder
        fields = [
            'id',
            'user',
            'name',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'user',
            'created_at',
        ]