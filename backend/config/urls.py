from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

from accounts.views import TopView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", TopView.as_view(), name="top"),
    path("accounts/", include("accounts.urls")),
    path("", include("novel.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)