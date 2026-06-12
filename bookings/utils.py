import requests
from django.conf import settings

BOT_TOKEN = settings.BOT_TOKEN
GROUP_CHAT_ID = settings.GROUP_CHAT_ID


def is_makon_club_member(telegram_id):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getChatMember"
    payload = {
        "chat_id": GROUP_CHAT_ID,
        "user_id": telegram_id
    }

    try:
        response = requests.post(url, json=payload).json()
        if response.get("ok"):
            status = response["result"]["status"]
            # if user active in group
            if status in ["member", "administrator", "creator"]:
                return True
        return False

    except Exception:
        return False

    