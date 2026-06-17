from django.db import models
from multiselectfield import MultiSelectField
from django.utils import timezone

class Tour(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.IntegerField()
    max_people = models.IntegerField()
    image = models.ImageField(upload_to='tours/')
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    is_top = models.BooleanField(
        default=False,
        verbose_name="Top tur (Asosiy sahifada yulduzcha bilan chiqadi)"
    )

    has_club_discount = models.BooleanField(
        default=True,
        verbose_name="Makon Club guruhi uchun 50k chegirma mavjud"
    )

    tour_date = models.DateField(
        verbose_name="Tur bo'lib o'tadigan sana (Userlarga ko'rinadi)"
    )
    expiration_datetime = models.DateTimeField(
        verbose_name="Tur paketning tugash muddati (Shu vaqtdan keyin arxivlanadi)"
    )

    @property
    def is_active(self):
        return timezone.now() < self.expiration_datetime


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
    