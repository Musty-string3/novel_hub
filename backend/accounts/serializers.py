from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    """
    取得したいユーザーの情報を全て返す
    """
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
            'created_at',
            'updated_at',
        ]