from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static


def home(request):
    return HttpResponse("Makon Django ishlayapti")



urlpatterns = [
    path('', home),

    path('admin/', admin.site.urls),
    path('api/tours/', include('tours.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/users/', include('users.urls')),
    path('api/payments/', include('payments.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
