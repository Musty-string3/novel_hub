from rest_framework import serializers

from ..models import *
from accounts.serializers import UserSerializer
from .novel import *
from .folder import *


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = [
            'id',
            'character',
            'message',
            'direction',
            'image_url',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'created_at',
        ]