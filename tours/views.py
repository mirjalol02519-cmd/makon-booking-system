from rest_framework import generics
from .models import Tour
from .serializers import TourSerializer
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.decorators import api_view


class TourListView(generics.ListCreateAPIView):
    queryset = Tour.objects.filter(is_available=True)
    serializer_class = TourSerializer


class TourDetailView(generics.RetrieveAPIView):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer


@api_view(['GET'])
def get_active_tours(request):
    now = timezone.now()
    active_tours = Tour.objects.filter(expiration_datetime__gt=now)
    
    serializer = TourSerializer(active_tours, many=True)
    return Response(serializer.data)
    
