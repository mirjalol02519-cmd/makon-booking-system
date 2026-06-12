from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

def main_menu():
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="🌍 Turlarni ko'rish",
                web_app=WebAppInfo(url="https://impale-spinal-majority.ngrok-free.dev")
            )
        ],
        [
            InlineKeyboardButton(
                text="📋 Mening bronlarim",
                callback_data="my_bookings"
            )
        ]
    ])
    return keyboard