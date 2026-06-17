import aiohttp
import os 
from django.utils import timezone
from django.db.models import Sum, Count
from bookings.models import Booking, Passenger
from tours.models import Tour

BASE_URL = "https://makon-booking-system-production.up.railway.app/api"

def get_admin_main_stats():
    today = timezone.now().date()

    stats = Booking.objects.filter(created_at__date=today).aggregate(
        total_bookings=Count('id'),
        total_revenue=Sum('total_price')
    )

    tours_report = []
    for tour in Tour.objects.all():
        tour_bookings = Booking.objects.filter(tour=tour, created_at__date=today)
        booking_count = tour_bookings.count()
        revenue = tour_bookings.aggregate(Sum('total_price'))['total_price__sum'] or 0

        # count free seats
        reserved_seats = tour_bookings.aggregate(Sum('people_count'))['people_count__sum'] or 0
        max_people = getattr(tour, 'max_people', 20)
        seats_left = max(0, max_people - reserved_seats)

        tours_report.append({
            "tour_id": tour.id,
            "title": tour.title,
            "bookings": booking_count,
            "revenue": revenue,
            "seats_left": seats_left
        })
    return stats, tours_report


async def register_user(telegram_id, first_name, last_name, username):
    async with aiohttp.ClientSession() as session:
        await session.post(f"{BASE_URL}/users/register/", json={
            "telegram_id": telegram_id,
            "first_name": first_name,
            "last_name": last_name,
            "username": username
        })

def get_passengers_by_tour(tour_id):
    today = timezone.now().date()
    bookings = Booking.objects.filter(tour_id=tour_id, created_at__date=today)
    
    # Get passengers info
    passengers = []
    for b in bookings:
        for p in b.passengers.all(): 
            passengers.append({
                "id": p.id,
                "full_name": p.full_name
            })
    return passengers

def get_passenger_detail(passenger_id):
    try:
        p = Passenger.objects.get(id=passenger_id)
        booking = p.booking 
        user = booking.user 
        return {
            "full_name": p.full_name,
            "phone": p.phone_number,
            "tg_id": user.telegram_id,
            "username": getattr(user, 'username', 'Mavjud emas'),
            "status": booking.status, 
            "total_price": booking.total_price,
            "tour_id": booking.tour.id
        }
    except Passenger.DoesNotExist:
        return None


async def get_tours():
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{BASE_URL}/tours/") as response:
            return await response.json()



async def notify_payment_success(bot, telegram_id, tour_title):
    await bot.send_message(
        chat_id=telegram_id,
        text=f"✅ To'lovingiz qabul qilindi!\n\n"
             f"🌍 Tur: {tour_title}\n"
    )