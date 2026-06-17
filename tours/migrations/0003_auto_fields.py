from django.db import migrations, models
import django.utils.timezone

class Migration(migrations.Migration):

    dependencies = [
        ('tours', '0002_tourinclude'),  
    ]

    operations = [
        migrations.AddField(
            model_name='tour',
            name='is_top',
            field=models.BooleanField(default=False, verbose_name='Top tur (Asosiy sahifada yulduzcha bilan chiqadi)'),
        ),
        migrations.AddField(
            model_name='tour',
            name='has_club_discount',
            field=models.BooleanField(default=True, verbose_name='Makon Club guruhi uchun 50k chegirma mavjud'),
        ),
        migrations.AddField(
            model_name='tour',
            name='tour_date',
            field=models.DateField(default=django.utils.timezone.now, verbose_name="Tur bo'lib o'tadigan sana (Userlarga ko'rinadi)"),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='tour',
            name='expiration_datetime',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='Tur paketning tugash muddati (Shu vaqtdan keyin arxivlanadi)'),
            preserve_default=False,
        ),
    ]