from django.urls import path

from .views import *


app_name = 'folder and novel'

urlpatterns = [
    path("folders", FoldersView.as_view(), name="folder_list_create"),
    path("folders/<int:pk>", FolderUpdateDeleteView.as_view(), name="folder_update_delete"),
    path("folders/<int:pk>/novels", NovlesView.as_view(), name="novle_create"),
    path("novels/<int:pk>", NovelUpdateDeleteView.as_view(), name="novel_update_delete"),
    path("novels/<int:pk>/message/", MessagesView.as_view(), name="novel_list_create"),
    path("novels/<int:novel_pk>/message/<int:pk>", MessagesUpdateDeleteView.as_view(), name="novel_update_delete"),
]