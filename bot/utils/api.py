import aiohttp
import os 

BASE_URL = "http://127.0.0.1:8000/api"

async def register_user(telegram_id, first_name, last_name, username):
    async with aiohttp.ClientSession() as session:
        await session.post(f"{BASE_URL}/users/register/", json={
            "telegram_id": telegram_id,
            "first_name": first_name,
            "last_name": last_name,
            "username": username
        })



async def get_tours():
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{BASE_URL}/tours/") as response:
            return await response.json()



async def notify_payment_success(bot, telegram_id, tour_title):
    await bot.send_message(
        chat_id=telegram_id,
        text=f"✅ To'lovingiz qabul qilindi!\n\n"
             f"🌍 Tur: {tour_title}\n"
             f"Tez orada menejer siz bilan bog'lanadi."
    )