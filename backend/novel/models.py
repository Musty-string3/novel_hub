from django.db import models
from django.conf import settings


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
    folder = models.ForeignKey(Folder, verbose_name="フォルダ", on_delete=models.CASCADE, related_name="novel")
    title = models.CharField(verbose_name="タイトル", max_length=100)
    description = models.CharField(verbose_name="説明", max_length=1000, null=True, blank=True)
    is_public = models.BooleanField(verbose_name="公開設定", default=True)
    show_speaker = models.BooleanField(verbose_name="キャラクター名表示有無", default=True)
    background_color = models.CharField(verbose_name="背景色", max_length=50, default="#ffffff")
    view_count = models.IntegerField(verbose_name="閲覧数", default=0, null=True, blank=True)
    movie_url = models.CharField(verbose_name="動画書き出しURL", max_length=500, null=True, blank=True)

    created_at = models.DateTimeField(verbose_name='データ作成日時', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='データ更新日時', auto_now=True)


    def __str__(self):
        return self.title

    class Meta():
        verbose_name_plural = '03-02.小説'
        db_table = 'novel'