from rest_framework import serializers
from .models import Tour, TourInclude


class TourIncludeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourInclude
        fields = ['icon', 'label']


class TourSerializer(serializers.ModelSerializer):
    includes = TourIncludeSerializer(many=True, read_only=True)
    
    class Meta:
        model = Tour
        fields = '__all__'