from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Profile

import logging
logger = logging.getLogger("web")


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        try:
            name = instance.email.split("@")[0]
        except IndexError:
            name = instance.email or f"ユーザー{str(instance.id)}"

        ## すでにプロフィール登録がある場合は処理終了
        if not hasattr(instance, "profile"):

            ## 重複するユーザーネームの場合はメールアドレスそのものをユーザーネームに設定する
            profile_exists = Profile.objects.filter(name=name).exists()
            if profile_exists:
                name = instance.email

            try:
                Profile.objects.create(user=instance, name=name)
            except Exception as e:
                logger.error(f"ユーザー新規登録時のProfile作成失敗: user_id: {instance.id}, error={e}")