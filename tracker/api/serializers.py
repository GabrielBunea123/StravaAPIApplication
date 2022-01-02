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
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    quantity = serializers.IntegerField()
    kcal = serializers.IntegerField()
    proteins = serializers.IntegerField()
    carbs = serializers.IntegerField()
    fats = serializers.IntegerField()
    sugars = serializers.IntegerField()
    fibers=serializers.IntegerField()
    date = serializers.CharField()

class DeleteDailyFoodSerializer(serializers.Serializer):
    creator = serializers.CharField()
    date=serializers.CharField()
    product_id = serializers.IntegerField()
    daily_food_id=serializers.IntegerField()
    meal=serializers.CharField()

class EditDailyFoodSerializer(serializers.Serializer):
    creator = serializers.CharField()
    quantity=serializers.IntegerField()
    date=serializers.CharField()
    meal=serializers.CharField()
    daily_food_id=serializers.IntegerField()
    product_id = serializers.IntegerField()

class DailyFoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDailyFood
        fields="__all__"
        depth=1

class GetDailyFoodSerializer(serializers.Serializer):
    creator = serializers.CharField()
    date = serializers.CharField()


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
        
