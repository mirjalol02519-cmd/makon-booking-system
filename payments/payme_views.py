import base64
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.utils import timezone
import json
from .models import Payment
from bookings.models import Booking


@method_decorator (csrf_exempt, name='dispatch')
class PaymeWebhookView(View):

    def post(self, request):
        auth = request.META.get('HTTP_AUTHORIZATION', '')
        if auth.startswith('Basic '):
            decoded = base64.b64decode(auth[6:]).decode()
            _, key = decoded.split(':', 1)
            if key != os.getenv('PAYME_SECRET_KEY'):
                return JsonResponse({'error': {'code': -32504}})
            

        body = json.loads(request.body)
        method = body.get('method')
        params = body.get('params', {})
        request_id = body.get('id')


        if method == 'CheckPerformTransaction':
            booking_id = params['account'].get('booking_id')
            try:
                booking = Booking.objects.get(id=booking_id)
                return JsonResponse({
                    'result': {'allow': True},
                    'id': request_id
                })
            except Booking.DoesNotExist:
                return JsonResponse({'error': {'code': -31050}})
            
        
        elif method == 'PerformTransaction':
            transaction_id = params.get('id')
            booking_id = params['account'].get('booking_id')

            try:
                booking = Booking.objects.get(id=booking_id)
                payment, _ = Payment.objects.get_or_create(
                    booking=booking,
                    defaults={
                        'amount': booking.total_price,
                        'provider': 'payme',
                    }
                )
                payment.status = 'paid'
                payment.transaction_id = transaction_id
                payment.paid_at = timezone.now()
                payment.save()

                booking.status = 'confirmed'
                booking.save()

                return JsonResponse({
                    'result': {
                        'transaction': transaction_id,
                        'perform_time': int(timezone.now().timestamp() * 1000),
                        'state': 2
                    },
                    'id': request_id
                })
            except Booking.DoesNotExist:
                return JsonResponse({'error': {'code': -31050}})
            
        return JsonResponse({'error': {'code': -32601}})
