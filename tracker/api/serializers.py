from rest_framework import serializers
from .models import *

#PRODUCTS
class AddProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields="__all__"
        depth=1

class ProductDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Products
        fields=['product_id']

#DAILY FOOD
class AddFoodSerializer(serializers.Serializer):
    creator = serializers.CharField()
    meal = serializers.CharField()
    product_id = serializers.CharField()
    product_name = serializers.CharField()
    quantity = serializers.FloatField()
    kcal = serializers.FloatField()
    proteins = serializers.FloatField()
    carbs = serializers.FloatField()
    fats = serializers.FloatField()
    sugars = serializers.FloatField()
    fibers=serializers.FloatField()
    date = serializers.CharField()

class DeleteDailyFoodSerializer(serializers.Serializer):
    creator = serializers.CharField()
    date=serializers.CharField()
    product_id = serializers.CharField()
    daily_food_id=serializers.FloatField()
    meal=serializers.CharField()

class EditDailyFoodSerializer(serializers.Serializer):
    creator = serializers.CharField()
    quantity=serializers.FloatField()
    date=serializers.CharField()
    meal=serializers.CharField()
    daily_food_id=serializers.IntegerField()
    product_id = serializers.CharField()

class DailyFoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDailyFood
        fields="__all__"
        depth=1

class GetDailyFoodSerializer(serializers.Serializer):
    creator = serializers.CharField()
    date = serializers.CharField()

class GetAllDailyFoodSerializer(serializers.Serializer):
    creator = serializers.CharField()


#RECENT FOOD
class RecentUserFoodsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecentUserFoods
        fields="__all__"
        depth=1

class GetRecentUserFoodsSerializer(serializers.ModelSerializer):
    class Meta:
        model=RecentUserFoods
        fields=['creator']
        depth=1

class SearchFoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields=['product']
        depth=1

#KCAL GOAL

class KcalGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = KcalGoal
        fields="__all__"
class GetKcalGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = KcalGoal
        fields=['creator']
        
