from rest_framework import serializers
from .models import *

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserDetails
        fields="__all__"

class UserStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserStats
        fields="__all__"

class CreateActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ("name",'activity_type','elapsed_time',"description",'distance')

class GetAllActivitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model=Activity
        fields="__all__"
        depth=1

class GetActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ("name",'activity_id','activity_type','elapsed_time',"description",'distance')
        depth=1

class GetOneStravaActivitySerializer(serializers.Serializer):
    activity_id = serializers.CharField()

class GetRouteSerializer(serializers.Serializer):
    route_id = serializers.CharField()