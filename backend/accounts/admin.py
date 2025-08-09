from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import *

class CustomUserAdmin(BaseUserAdmin):
    # 表示するフィールドセットを定義
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("ステータス", {"fields": ("email_verified", "is_active", "is_staff")}),
        ("カラム", {"fields": ("provider", "provider_id", "last_login", "theme_preference")}),
    )

    list_display = ("id", "email", "provider",  "is_staff", "is_active", "last_login", "created_at", "updated_at")
    search_fields = ("email",)
    ordering = ("id",)


class CustomProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "name", "is_public", "created_at", "updated_at")
    search_fields = ("name", "user__email")
    ordering = ("user",)

admin.site.register(Profile, CustomProfileAdmin)
admin.site.register(User, CustomUserAdmin)


