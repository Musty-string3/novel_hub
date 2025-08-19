from rest_framework import serializers

from ..models import *
from accounts.serializers import UserSerializer
from .novel import *
from .folder import *


class MessageSerializer(serializers.ModelSerializer):
    direction_label = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id',
            'character',
            'message',
            'order',
            'direction',
            'direction_label',
            'image_url',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'created_at',
        ]

    def get_direction_label(self, obj):
        return obj.get_direction_display()