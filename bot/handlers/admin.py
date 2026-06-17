import os
from dotenv import load_dotenv
from aiogram import Router, F, types
from aiogram.filters import Command
from asgiref.sync import sync_to_async
from bot.utils.api import get_admin_main_stats, get_passengers_by_tour, get_passenger_detail
from bot.keyboards.main import get_admin_tours_keyboard, get_passengers_keyboard, get_back_to_passengers_keyboard


load_dotenv()
router = Router()

raw_admin_ids = os.getenv("ADMIN_ID", "").strip()
if raw_admin_ids:
    ADMIN_ID = [int(i.strip()) for i in raw_admin_ids.split(",") if i.strip().isdigit()]
else:
    ADMIN_ID = []

@router.message(Command("admin"))
async def admin_main_menu(message: types.Message):
    if message.from_user.id not in ADMIN_ID:
        return

    try:
        stats, tours_report = await sync_to_async(get_admin_main_stats)()
        
        text = f"📊 **ADMIN STATISTIKA** (Sana: {stats.get('date', 'Bugun')})\n\n"
        text += f"• **Umumiy bronlar:** {stats['total_bookings']} ta\n"
        text += f"• **Umumiy tushum:** {stats['total_revenue'] or 0} so'm\n\n"
        text += "🏔 **Turlar bo'yicha hisobot:**\n"
        
        for t in tours_report:
            text += f"\n🔹 {t['title']}: {t['bookings']} ta bron | {t['revenue']} so'm | O'rin: {t['seats_left']}"
            
        text += "\n\n👇 Batafsil ma'lumot uchun turni tanlang:"
        
        await message.answer(
                    text=text, 
                    reply_markup=get_admin_tours_keyboard(tours_report),
                    parse_mode="Markdown"
                )

    except Exception as err:
        await message.answer(f"❌ Admin panel yuklanishida ichki xatolik: {str(err)}")


@router.callback_query(F.data.startswith("admin_tour_"))
async def show_tour_passengers(callback: types.CallbackQuery):
    tour_id = int(callback.data.split("_")[2])
    passengers = get_passengers_by_tour(tour_id)
    
    if not passengers:
        await callback.answer("Bu turga hozircha yo'lovchi yo'q", show_alert=True)
        return
        
    await callback.message.edit_text(
        text="🏞 Tanlangan tur bo'yicha yo'lovchilar ro'yxati:\nBatafsil ma'lumot uchun ismni bosing:",
        reply_markup=get_passengers_keyboard(passengers, tour_id)
    )

@router.callback_query(F.data.startswith("admin_pass_"))
async def show_passenger_info(callback: types.CallbackQuery):
    p_id = int(callback.data.split("_")[2])
    info = get_passenger_detail(p_id)
    
    if not info:
        await callback.answer("Ma'lumot topilmadi.")
        return
        
    text = f"👤 **FOYDALANUVCHI MA'LUMOTI**\n\n" \
           f"• **Ism: ** {info['full_name']}\n" \
           f"• **Tel:** {info['phone']}\n" \
           f"• **Telegram ID:** `{info['tg_id']}`\n" \
           f"• **Username:** @{info['username']}\n" \
           f"• **Status:** 🟢 {info['status']}\n" \
           f"• **To'langan summa:** {info['total_price']} so'm"
           
    await callback.message.edit_text(text=text, reply_markup=get_back_to_passengers_keyboard(info['tour_id']))

@router.callback_query(F.data == "admin_back_tours")
async def back_to_main_admin(callback: types.CallbackQuery):
    stats, tours_report = get_admin_main_stats()
    text = f"📊 **ADMIN STATISTIKA**\n\n• **Umumiy bronlar:** {stats['total_bookings']}\n• **Umumiy tushum:** {stats['total_revenue'] or 0} so'm\n"
    await callback.message.edit_text(text=text, reply_markup=get_admin_tours_keyboard(tours_report))