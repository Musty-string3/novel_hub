import os

from django.conf import settings
from django.core.mail import send_mail


def get_signature():

    signature = '''
---------------------------------
※本メールは自動送信です。
返信いただいてもご連絡いたしかねますのでご了承ください。
---------------------------------
'''
    return signature


## メール送信メソッド
def send_email(email, title, body):
    from_email = settings.DEFAULT_FROM_EMAIL
    email_to = os.getenv('EMAIL_HOST_USER')

    ## メール送信
    send_mail(
        subject=title,
        message=body,
        from_email=from_email,
        ## ! 実際に送信されるメール（本番想定）
        # recipient_list=[email]
        ## 開発環境では自身のメールに送信する
        recipient_list=[email_to]
    )
    return



## ユーザー新期登録時のトークン認証メール
def signup_verify_email(verify_url, email):
    get_signature()
    signature = get_signature()
    title = "メールアドレス認証"
    from_email = settings.DEFAULT_FROM_EMAIL
    body = f"""
メールアドレスの仮登録ありがとうございます。

メール認証はメールアドレスの仮登録から60分以内に行なってください。
60分が経過した場合、メールアドレス仮登録をもう一度行なってください。

以下のリンクをクリックして認証してください。
{verify_url}

{signature}
    """
    send_email(email, title, body)