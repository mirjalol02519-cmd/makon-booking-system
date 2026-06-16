import os
import threading
import subprocess
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()

def run_bot():
    try:
        subprocess.Popen(["python", "bot/main.py"])
        print("--- Bot Django ichida parallel fonda ishga tushirildi ---")
    except Exception as e:
        print(f"Botni fonda yoqishda xatolik: {e}")

if os.getenv('RAILWAY_ENVIRONMENT') is not None:
    bot_thread = threading.Thread(target=run_bot, daemon=True)
    bot_thread.start()