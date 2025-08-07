from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import *


app_name = 'accounts'

urlpatterns = [
    path("", TopView.as_view(), name="top"),
    path("signup", SignUpView.as_view(), name="signup"),
    path("verify_email", VerifyEmailView.as_view(), name="verify_email"),
    ## ログイン
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]