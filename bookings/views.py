from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny

from .models import Booking
from .serializers import BookingSerializer


from users.models import TelegramUser 
from bookings.serializers import is_makon_club_member


class CheckGroupMembershipView(APIView):
    def get(self, request):
        telegram_id = request.query_params.get('telegram_id')

        if not telegram_id:
            return Response(
                {"error": "telegram_id parametri yuborilmadi"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # check in group
        is_member = is_makon_club_member(telegram_id)

        return Response({
            "telegram_id": telegram_id,
            "is_member": is_member
        }, status=status.HTTP_200_OK)


class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer

    def create(self, request, *args, **kwargs):
        telegram_id = request.data.get('user')
        
        if not telegram_id:
            return Response({"error": "Foydalanuvchi ID si topilmadi"}, status=status.HTTP_400_BAD_REQUEST)

        user_obj, created = TelegramUser.objects.get_or_create(
            telegram_id=str(telegram_id),
            defaults={
                'username': request.data.get('username', f"user_{telegram_id}"),
                'first_name': request.data.get('first_name', f"User_{telegram_id}")
            }
        )
        
        data = request.data.copy()
        data['user'] = user_obj.id  
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        tour = serializer.validated_data['tour']
        people = serializer.validated_data['people_count']
        total = tour.price * people
        serializer.save(total_price=total)


class MyBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer

    def get_queryset(self):
        telegram_id = self.request.query_params.get('telegram_id')
        
        print("\n=== BRONLARNI QIDIRISH BOSHLANDI ===")
        print(f"Frontenddan kelgan Telegram ID: {telegram_id}")
        
        if not telegram_id or telegram_id == 'undefined':
            return Booking.objects.none()
            
        try:
            user_obj = TelegramUser.objects.get(telegram_id=telegram_id)
            print(f"Topilgan foydalanuvchi: {user_obj.username}")
            return Booking.objects.filter(user=user_obj).select_related('tour').order_by('-created_at')
            
        except TelegramUser.DoesNotExist:
            print(f"OGOHLANTIRISH: Bazada telegram_id={telegram_id} bo'lgan foydalanuvchi topilmadi!")
            return Booking.objects.none()
            
        print("===================================\n")



@method_decorator(csrf_exempt, name='dispatch')
class PaymentSimulationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        booking_id = request.data.get('booking_id')
        provider = request.data.get('provider')

        try:
            booking = Booking.objects.get(id=booking_id)
            booking.status = 'Paid'
            booking.save()

            return Response({
                "status": "success",
                "message": f"{provider.upper()} orqali tolov muvafaqqiyatli qilindi!"
            }, status=status.HTTP_200_OK)
        
        except Booking.DoesNotExist:
            return Response({
                "status": "error",
                "message": "Bron topilmadi!"
            }, status=status.HTTP_404_NOT_FOUND)