from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from .views import *


app_name = 'accounts'

urlpatterns = [
    path("", TopView.as_view(), name="top"),
    ## ユーザー新規登録
    path("signup", SignUpView.as_view(), name="signup"),
    path("verify_email", VerifyEmailView.as_view(), name="verify_email"),
    ## ログイン
    path("login", CustomTokenObtainPairView.as_view(), name="login"),
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),

    ## ログアウト
    path("logout", LogoutView.as_view(), name="logout"),

    path("me", MeView.as_view(), name="me"),
    path("profile", ProfileView.as_view(), name="profile"),
]