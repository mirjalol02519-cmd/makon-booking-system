import asyncio
import os 
import sys
import django

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
sys.path.append(PARENT_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from dotenv import load_dotenv
from aiogram import Bot, Dispatcher
from handlers import start
from bot.handlers import start, admin


load_dotenv()

bot = Bot(token=os.getenv('BOT_TOKEN'))
dp = Dispatcher()


async def main ():
    dp.include_router(start.router)
    dp.include_router(admin.router)
    

    await dp.start_polling(bot)


if __name__ == '__main__':
    asyncio.run(main())


