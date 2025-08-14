from rest_framework import serializers

from ..models import *
from accounts.serializers import UserSerializer
from .message import *
from .folder import *


class NovelDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Novel
        fields = [
            'id',
            'user',
            'messages',
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
            'messages',
            'created_at',
        ]



class NovelSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

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