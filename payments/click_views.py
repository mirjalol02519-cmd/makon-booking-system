import hashlib
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.utils import timezone
from .models import Payment
from bookings.models import Booking

print("CLICK VIEWS FAYL YUKLANDI")

@method_decorator(csrf_exempt, name='dispatch')
class ClickWebhookView(View):

    def post(self, request):
        data = request.POST

        click_trans_id = data.get('click_trans_id')
        merchant_trans_id = data.get('merchant_trans_id')
        amount = float(data.get('amount', 0))
        action = int(data.get('action', 0))
        sign_string = data.get('sign_string')
        secret_key = os.getenv('CLICK_SECRET_KEY')

        
        print("="*40)
        print(f"click_trans_id:    '{click_trans_id}'")
        print(f"merchant_trans_id: '{merchant_trans_id}'")
        print(f"secret_key:        '{secret_key}'")
        print(f"amount:            '{amount}'")

        my_sign = hashlib.md5(
            f"{click_trans_id}{merchant_trans_id}{secret_key}{amount}".encode()
        ).hexdigest()

        print(f"my_sign:           '{my_sign}'")
        print(f"their_sign:        '{sign_string}'")
        print("="*40)

        # Imzo tekshirish
        # if my_sign != sign_string:
        #     return JsonResponse({'error': -1, 'error_note': 'Invalid_sign'})

        # Booking mavjudligini tekshirish
        try:
            booking = Booking.objects.get(id=merchant_trans_id)
        except Booking.DoesNotExist:
            return JsonResponse({'error': -5, 'error_note': 'Booking not found'})

        # action=0 → faqat tekshirish
        if action == 0:
            return JsonResponse({
                'error': 0,
                'error_note': 'Success',
                'click_trans_id': click_trans_id,
                'merchant_trans_id': merchant_trans_id,
            })

        # action=1 → to'lov tasdiqlash
        elif action == 1:
            payment, _ = Payment.objects.get_or_create(
                booking=booking,
                defaults={
                    'amount': booking.total_price,
                    'provider': 'click',
                }
            )
            payment.status = 'paid'
            payment.transaction_id = click_trans_id
            payment.paid_at = timezone.now()
            payment.save()

            booking.status = 'confirmed'
            booking.save()

            return JsonResponse({
                'error': 0,
                'error_note': 'Success',
            })