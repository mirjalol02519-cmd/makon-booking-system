from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder


def get_admin_tours_keyboard(tours_list):
    builder = InlineKeyboardBuilder()
    for tour in tours_list:
        builder.row(InlineKeyboardButton(
            text=f"🏞 {tour['title']}",
            callback_data=f"admin_tour_{tour['tour_id']}"
        ))
    return builder.as_markup()


def get_passengers_keyboard(passengers_list, tour_id):
    builder = InlineKeyboardBuilder()
    for passenger in passengers_list:
        builder.row(InlineKeyboardButton(
            text=f"🧑‍💻 {passenger['full_name']}",
            callback_data=f"admin_pass_{passenger['id']}"
        ))
    builder.row(InlineKeyboardButton(text="⬅️ Orqaga (Turlarga)", callback_data='admin_back_tours'))
    return builder.as_markup()


def get_back_to_passengers_keyboard(tour_id):
    builder = InlineKeyboardBuilder()
    builder.row(InlineKeyboardButton(text="⬅️ Ro'yxatga qaytish", callback_data=f"admin_tour_{tour_id}"))
    builder.row(InlineKeyboardButton(text="🏠 Admin Asosiy", callback_data="admin_back_tours"))
    return builder.as_markup()


def main_menu():
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="🌍 Turlarni ko'rish",
                web_app=WebAppInfo(url="https://makontrip.uz")
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