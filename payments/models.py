from django.db import models


class Payment(models.Model):
    PROVIDER_CHOICES = [
            ('click', 'Click'),
            ('payme', 'Payme'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Kutilmoqda'),
        ('processing', 'Jarayonda'),
        ('paid', 'To\'landi'),
        ('failed', 'Xato'),
        ('cancelled', 'Bekor qilindi'),
    ]


    booking = models.OneToOneField('bookings.Booking', on_delete=models.CASCADE)
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateField(null=True, blank=True)
