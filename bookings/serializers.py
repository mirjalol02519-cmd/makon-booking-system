import requests
from rest_framework import serializers
from django.conf import settings 
from .models import Booking, Passenger
from tours.models import Tour
from decimal import Decimal

def is_makon_club_member(telegram_id):
    if hasattr(telegram_id, 'telegram_id'):  
        telegram_id = telegram_id.telegram_id
    elif hasattr(telegram_id, 'id'):          
        telegram_id = telegram_id.id

    bot_token = settings.BOT_TOKEN
    group_chat_id = settings.GROUP_CHAT_ID

    if not bot_token or not group_chat_id:
        print("❌ XATOLIK: .env faylida token yoki guruh ID ko'rsatilmagan!")
        return False

    if str(telegram_id) == "1":
        print("⚠️ OGOHLANTIRISH: Telegram ID '1' deb keldi. Brauzerda test qilinyapti, chegirma berilmaydi.")
        return False

    url = f"https://api.telegram.org/bot{bot_token}/getChatMember"
    payload = {
        "chat_id": group_chat_id,
        "user_id": int(telegram_id)  
    }
    
    try:
        response = requests.post(url, json=payload, timeout=5)
        res_json = response.json()
        
        print(f"🤖 Telegram API Javobi ({telegram_id} uchun):", res_json)

        if res_json.get("ok"):
            status = res_json["result"]["status"]
            if status in ["member", "administrator", "creator", "restricted"]:
                return True
        else:
            print(f"ℹ️ Foydalanuvchi guruhda topilmadi: {res_json.get('description')}")
            return False
            
        return False
    except Exception as e:
        print(f"❌ Telegram API bilan ulanishda texnik xato: {e}")
        return False


class PassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = ['id', 'full_name', 'phone_number']


class BookingSerializer(serializers.ModelSerializer):
    passengers = PassengerSerializer(many=True, required=False)
    total_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    use_discount = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = Booking
        fields = ['id', 'user', 'tour', 'people_count', 'total_price', 'status', 'passengers', 'created_at', 'use_discount']

    def create(self, validated_data):
        passengers_data = validated_data.pop('passengers', [])
        use_discount = validated_data.pop('use_discount', False)
        
        tour = validated_data['tour']
        people_count = validated_data['people_count']
        telegram_id = validated_data['user']

        calculated_price = tour.price * Decimal(people_count)

        # Security and discount logic
        if use_discount:
            if is_makon_club_member(telegram_id):
                calculated_price = calculated_price - Decimal(50000)
                
                if hasattr(Booking, 'use_discount'):
                    validated_data['use_discount'] = True
            else:
                raise serializers.ValidationError({
                    "use_discount": "Siz Makon Club guruhi a'zosi emassiz! Chegirmadan foydalanish uchun guruhga a'zo bo'ling."
                })

        validated_data['total_price'] = max(calculated_price, Decimal(0))

        booking = Booking.objects.create(**validated_data)

        for passenger_data in passengers_data:
            Passenger.objects.create(booking=booking, **passenger_data)

        return booking