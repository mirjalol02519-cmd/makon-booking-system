from django.conf import settings

class PaymentManager:
    @staticmethod
    def get_click_url(booking_id, amount):
        base_url = "https://my.click.uz/services/pay"
        
        return f"{base_url}?service_id={settings.CLICK_SERVICE_ID}&merchant_id={settings.CLICK_MERCHANT_ID}&amount={amount}&transaction_param={booking_id}"

    @staticmethod
    def get_payme_url(booking_id, amount):
        base_url = "https://checkout.paycom.uz" 
        