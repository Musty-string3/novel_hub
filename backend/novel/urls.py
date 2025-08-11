from django.urls import path

from .views import *


app_name = 'folder and novel'

urlpatterns = [
    path("folders", FoldersView.as_view(), name="folder_list_create"),
    path("folders/<int:pk>", FolderUpdateDeleteView.as_view(), name="folder_update_delete"),
]