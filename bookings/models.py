from django.db import models



class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Kutilmoqda'),
        ('confirmed', 'Tasdiqlandi'),
        ('cancelled', 'Bekor qilindi'),
    ]

    user = models.ForeignKey('users.TelegramUser', on_delete=models.CASCADE)
    tour = models.ForeignKey('tours.Tour', on_delete=models.CASCADE)
    people_count = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    use_discount = models.BooleanField(default=False)


class Passenger(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='passengers')
    full_name = models.CharField(max_length=255) # First_name, last_name
    phone_number = models.CharField(max_length=20) # Phone number


    def __str__(self):
        return f"{self.user} - {self.tour}"


