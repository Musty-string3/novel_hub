from rest_framework import serializers

from ..models import *
from accounts.serializers import UserSerializer
from .novel import *
from .folder import *


class MessageSerializer(serializers.ModelSerializer):
    novels = FolderSerializer(read_only=True)

    class Meta:
        model = Novel
        fields = [
            'id',
            'novels',
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