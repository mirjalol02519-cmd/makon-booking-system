import asyncio
import os 
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


