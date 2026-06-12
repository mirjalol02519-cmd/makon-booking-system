from django.contrib import admin
from .models import Tour, TourInclude


class TourIncludeInline(admin.TabularInline):
    model = TourInclude
    extra = 1 


@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    inlines = [TourIncludeInline]

