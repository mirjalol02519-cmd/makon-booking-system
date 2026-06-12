from rest_framework import generics
from .models import Tour
from .serializers import TourSerializer


class TourListView(generics.ListCreateAPIView):
    queryset = Tour.objects.filter(is_available=True)
    serializer_class = TourSerializer


class TourDetailView(generics.RetrieveAPIView):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer
    
