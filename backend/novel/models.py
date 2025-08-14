import os
from django.conf import settings

from django.db import models


def message_image_path(instance, filename):
    """
    画像の保存方法を指定

    novel/novel_id/filenameで保存する
    """
    return os.path.join("novel", str(instance.novel.id), filename)


def character_image_path(instance, filename):
    """
    画像の保存方法を指定

    character/user_id/filenameで保存する
    """
    return os.path.join("character",f"user_id:{str(instance.user.id)}", filename)


class Folder(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="ユーザー", on_delete=models.CASCADE, related_name="folders")
    name = models.CharField(verbose_name="フォルダ名", max_length=50)

    created_at = models.DateTimeField(verbose_name='データ作成日時', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='データ更新日時', auto_now=True)


    def __str__(self):
        return self.name

    class Meta():
        verbose_name_plural = '03-01.フォルダー'
        db_table = 'folder'


class Novel(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="ユーザー", on_delete=models.CASCADE, related_name="novels")
    folder = models.ForeignKey(Folder, verbose_name="フォルダ", on_delete=models.CASCADE, related_name="novels")
    title = models.CharField(verbose_name="タイトル", max_length=100)
    description = models.CharField(verbose_name="説明", max_length=1000, null=True, blank=True)
    is_public = models.BooleanField(verbose_name="公開設定", default=True)
    show_speaker = models.BooleanField(verbose_name="キャラクター名表示有無", default=True)
    background_color = models.CharField(verbose_name="背景色", max_length=50, default="#ffffff")
    view_count = models.IntegerField(verbose_name="閲覧数", default=0, null=True, blank=True)
    movie_url = models.CharField(verbose_name="動画書き出しURL", max_length=500, null=True, blank=True)

    created_at = models.DateTimeField(verbose_name='データ作成日時', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='データ更新日時', auto_now=True)

    class Meta():
        verbose_name_plural = '03-02.小説'
        db_table = 'novel'


class Character(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="ユーザー", on_delete=models.CASCADE, related_name="characters")
    name = models.CharField(verbose_name="キャラクー名", max_length=50)
    icon_url = models.ImageField(verbose_name="キャラクターアイコン", upload_to=character_image_path)

    created_at = models.DateTimeField(verbose_name='データ作成日時', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='データ更新日時', auto_now=True)

    class Meta():
        verbose_name_plural = '05-01.キャラクター'
        db_table = 'character'


class Message(models.Model):
    DIRECTION = (
        (0, "left"),
        (1, "center"),
        (2, "right"),
    )
    novel = models.ForeignKey(Novel, verbose_name="小説", on_delete=models.CASCADE, related_name="messages")
    character = models.ForeignKey(Character, verbose_name="キャラクター", on_delete=models.CASCADE, blank=True, null=True)
    message = models.CharField(verbose_name="メッセージ", max_length=1000, blank=True, null=True)
    direction = models.SmallIntegerField(verbose_name="吹き出し方向", choices=DIRECTION, default=0)
    image_url = models.ImageField(verbose_name="画像", upload_to=message_image_path, null=True, blank=True)
    order = models.IntegerField(verbose_name="表示順")

    created_at = models.DateTimeField(verbose_name='データ作成日時', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='データ更新日時', auto_now=True)


    class Meta():
        verbose_name_plural = '03-03.メッセージ'
        db_table = 'message'
        ## 小説ごとの単位でorder（表示順）が同じものは作成しないようユニーク制約をつける
        constraints = [
            models.UniqueConstraint(
                fields=["novel", "order"],
                name="unique_order_per_novel"
            )
        ]