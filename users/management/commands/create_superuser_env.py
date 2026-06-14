import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **options):
        User = get_user_model()

        username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
        email    = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@makontrip.uz')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

        if not password:
            self.stderr.write(
                self.style.ERROR(
                    'DJANGO_SUPERUSER_PASSWORD muhit o\'zgaruvchisi topilmadi. '
                    'Railway Variables bo\'limida qo\'shing.'
                )
            )
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(
                    f'Superuser "{username}" allaqachon mavjud. O\'tkazib yuborildi.'
                )
            )
            return

        User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
        )
        self.stdout.write(
            self.style.SUCCESS(
                f'Superuser "{username}" muvaffaqiyatli yaratildi!'
            )
        )