from django.urls import path
from .views import BookingCreateView, MyBookingsView, PaymentSimulationView, CheckGroupMembershipView


urlpatterns = [
    path('', BookingCreateView.as_view(), name='booking-create'),
    path('my/', MyBookingsView.as_view(), name='my-bookings'),
    path('payment-simulate/', PaymentSimulationView.as_view(), name='payment-simulate'),  
    path('api/users/check-membership/', CheckGroupMembershipView.as_view(), name='check-membership'),
]