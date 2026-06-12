from django.db import models

class TelegramUser(models.Model):
    telegram_id = models.BigIntegerField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    username = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    language = models.CharField(max_length=10, default='uz')
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.first_name} ({self.username})"