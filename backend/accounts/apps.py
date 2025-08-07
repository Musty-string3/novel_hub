from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    ## ユーザー作成時にプロフィールが自動で作成されるようシグナル登録しておく
    def ready(self):
        import accounts.signals
