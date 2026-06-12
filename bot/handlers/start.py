from aiogram import Router, F
from aiogram.filters import CommandStart
from aiogram.types import Message
from keyboards.main import main_menu
from utils.api import register_user
import json

router = Router()


@router.message(CommandStart())
async def start_handler(message: Message):
    # Save user to backend
    await register_user(
        telegram_id=message.from_user.id,
        first_name=message.from_user.first_name,
        last_name=message.from_user.last_name or "",
        username=message.from_user.username
    )


    await message.answer(
        f"Assalomu alaykum, {message.from_user.first_name}! 👋\n\n"
        f"Makon trip botiga xush kelibsiz 🌍\n"
        f"Quyidagi turlardan birini tanlang:",
        reply_markup=main_menu()
    )



@router.message(F.web_app_data)
async def web_app_handler(message: Message):
    data = json.loads(message.web_app_data.data)

    if data.get('action') == 'booked':
        await message.answer(
            "✅ Broningiz qabul qilindi!\n"
            "To'lov uchun quyidagi tugmani bosing:",
            # reply_markup=payment_keyboard()
        )