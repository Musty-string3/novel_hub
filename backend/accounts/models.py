from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ValidationError
from django.conf import settings


def path_and_name(self, instance):
    return

class UserManager(BaseUserManager):
    def create_superuser(self, email, password=None, **extra_fields):
        """
        createsuperuserで作成したユーザー
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("provider", 0)

        return self._create_user(email, password, **extra_fields)

    def create_user(self, email, password, **extra_fields):
        """
        createで作成したユーザー
        """
        if not email:
            raise ValueError("メールアドレスは必須です")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    PROVIDER = (
        (0, "local"),
        (1, "google"),
    )

    THEME_PREFERENCE= (
        (0, "ライト"),
        (1, "ダーク"),
        (2, "システムに合わせる"),
    )

    email = models.EmailField(verbose_name="メールアドレス", max_length=255, unique=True, db_index=True)
    email_verified = models.BooleanField(verbose_name="メール認証フラグ", default=False)
    password = models.CharField(verbose_name="パスワード", max_length=255, blank=True)
    provider = models.SmallIntegerField(verbose_name="プロバイダー識別子", choices=PROVIDER)
    provider_id = models.CharField(verbose_name="GoogleログインID", blank=True, null=True)
    theme_preference = models.SmallIntegerField(verbose_name="ダークモード設定", default=0, choices=THEME_PREFERENCE)
    is_active = models.BooleanField(verbose_name="アカウント有効", default=False)
    is_staff = models.BooleanField(verbose_name="スタッフフラグ", default=False)
    last_login = models.DateTimeField(verbose_name="最終ログイン日時", blank=True, null=True)
    created_at = models.DateTimeField(verbose_name='データ作成日時', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='データ更新日時', auto_now=True)
    
    ## 認証に使うフィールドを指定
    USERNAME_FIELD = "email"
    ## createsuperuser時に追加で必須にしたいフィールド
    REQUIRED_FIELDS = []

    objects = UserManager()

    def clean(self):
        ## Googleでログインした場合、Googleのログイン情報がない場合はモデルペースでエラーを吐かせる
        if self.provider == 1 and not self.provider_id:
            raise ValidationError("Googleログインの場合はprovider_idが必須です")

    def save(self, *args, **kwargs):
        ## バリデーションを自動で実行
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email

    class Meta():
        verbose_name_plural = '02-01.ユーザー'
        db_table = 'user'


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, verbose_name="ユーザー", on_delete=models.CASCADE, related_name="profile", unique=True)
    name = models.CharField(verbose_name="ニックネーム", max_length=50, unique=True)
    # profile_img = models.ImageField(verbose_name="プロフィール画像", upload_to=path_and_name, blank=True, null=True, default="profiles/default.png")
    bio = models.CharField(verbose_name="自己紹介", max_length=1000, blank=True, null=True)
    is_public = models.BooleanField(verbose_name="プロフィール公開設定", default=True)
    created_at = models.DateTimeField(verbose_name='データ作成日時', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='データ更新日時', auto_now=True)


    def __str__(self):
        return self.name

    class Meta():
        verbose_name_plural = '02-02.プロフィール'
        db_table = 'profile'


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