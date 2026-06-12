import asyncio
import os 
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher
from handlers import start

load_dotenv()

bot = Bot(token=os.getenv('BOT_TOKEN'))
dp = Dispatcher()


async def main ():
    dp.include_router(start.router)
    

    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())


