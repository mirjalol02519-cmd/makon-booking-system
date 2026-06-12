from django.db import models
from multiselectfield import MultiSelectField

class Tour(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.IntegerField()
    max_people = models.IntegerField()
    image = models.ImageField(upload_to='tours/')
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.title} - {self.price}"


class TourInclude(models.Model):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='includes')
    icon = models.CharField(max_length=10, default="✔️", help_text="Emoji yoki belgi (masalan: 🚌, 🍽, ✨)")
    label = models.CharField(max_length=100, verbose_name="Xizmat nomi")


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


    def __str__(self):
        return f"{self.icon} {self.label}"
    