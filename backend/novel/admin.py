from django.contrib import admin
from .models import *


class CustomFolderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "name", "created_at", "updated_at")
    search_fields = ("name", "user__id")
    ordering = ("id",)

class CustomNovelAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "folder", "title", "is_public", "view_count", "created_at", "updated_at")
    search_fields = ("name", "user__id")
    ordering = ("id",)

class CustomMessageAdmin(admin.ModelAdmin):
    list_display = ("id", "novel", "character", "direction", "order", "created_at", "updated_at")
    search_fields = ("novel", "character")
    ordering = ("id",)

class CustomCharacterAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "name", "created_at", "updated_at")
    search_fields = ("name", "user__id")
    ordering = ("id",)


admin.site.register(Folder, CustomFolderAdmin)
admin.site.register(Novel, CustomNovelAdmin)
admin.site.register(Message, CustomMessageAdmin)
admin.site.register(Character, CustomCharacterAdmin)


