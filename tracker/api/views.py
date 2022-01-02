from django.shortcuts import render, redirect
from rest_framework.views import APIView
from requests import Request, post
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
import json
from datetime import date

#PRODUCT
class GetProducts(APIView):
    serializer_class = AddProductSerializer
    def get(self,request):
        all_food = Products.objects.all()
        data = AddProductSerializer(all_food,many = True).data
        return Response(data,status= status.HTTP_200_OK)
        
class AddProduct(APIView):
    serializer_class = AddProductSerializer
    def post(self,request,format=None):

        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            product_name = serializer.data.get('product')
            quantity=serializer.data.get('quantity')
            kcal=serializer.data.get('kcal')
            proteins=serializer.data.get('proteins')
            carbs=serializer.data.get('carbs')
            fats=serializer.data.get('fats')
            sugars = serializer.data.get('sugars')
            fibers= serializer.data.get('fibers')
            obj = Products(product=product_name,quantity=quantity,kcal=kcal,proteins=proteins,carbs=carbs,fats=fats,sugars=sugars,fibers=fibers)
            obj.save()
            obj.product_id=obj.id
            obj.save()
            return Response(AddProductSerializer(obj).data,status=status.HTTP_201_CREATED)
        return Response({"Bad request":"Something went wrong"},status= status.HTTP_400_BAD_REQUEST)

class ProductDetails(APIView):
    serializer_class = ProductDetailsSerializer
    def post(self,request):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            product_id = serializer.data.get('product_id')
            product_details = Products.objects.filter(id=product_id)
            if product_details.exists():
                return Response(AddProductSerializer(product_details[0]).data,status=status.HTTP_200_OK)
            return Response({"NOT FOUND":"Something went wrong"},status= status.HTTP_404_NOT_FOUND)
        return Response({"Bad request":"Something went wrong"},status= status.HTTP_400_BAD_REQUEST)

class SearchFood(APIView):
    serializer_class=SearchFoodSerializer
    def post(self,request):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            product_name = serializer.data.get('product')
            products = Products.objects.filter(product__icontains=product_name)
            if products:
                data = AddProductSerializer(products,many = True).data
                return Response(data,status= status.HTTP_200_OK)
            return Response({"NOT FOUND":"THE FOOD WAS NOT FOUNDS"},status= status.HTTP_404_NOT_FOUND)
        return Response({'Bad request':"No recent food"},status = status.HTTP_400_BAD_REQUEST)

#DAILY FOOD
class AddDailyFood(APIView):
    serializer_class = AddFoodSerializer
    def post(self,request,format=None):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            creator = serializer.data.get('creator')
            meal = serializer.data.get('meal')
            product_name=serializer.data.get('product_name')
            quantity=serializer.data.get('quantity')
            kcal=serializer.data.get('kcal')
            proteins=serializer.data.get('proteins')
            carbs=serializer.data.get('carbs')
            fats=serializer.data.get('fats')
            sugars = serializer.data.get('sugars')
            fibers=serializer.data.get('fibers')
            product_id = serializer.data.get('product_id')
            added_date = serializer.data.get('date')

            user_food = UserDailyFood(creator=creator,meal=meal,product_name=product_name,quantity=quantity,kcal=kcal,proteins=proteins,carbs=carbs,fats=fats,sugars=sugars,fibers=fibers,date=added_date,product_id=product_id)
            user_food.save()

            return Response(AddFoodSerializer(user_food).data,status=status.HTTP_201_CREATED)
        return Response({'Bad request':"Try again"},status = status.HTTP_400_BAD_REQUEST)

class GetDailyUserFood(APIView):
    serializer_class = GetDailyFoodSerializer
    def post(self,request,format=None):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            creator = serializer.data.get('creator')
            date = serializer.data.get('date')
            daily_food = UserDailyFood.objects.filter(creator = creator,date=date)
            if daily_food.exists():
                data = DailyFoodSerializer(daily_food,many = True).data
                return Response(data,status= status.HTTP_200_OK)
            return Response({"Not found":"No food added"},status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad request':"No recent food"},status = status.HTTP_400_BAD_REQUEST)

class EditDailyFood(APIView):
    serializer_class = EditDailyFoodSerializer
    def put(self,request,format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            quantity=serializer.data.get('quantity')
            product_id = serializer.data.get('product_id')
            daily_food_id=serializer.data.get('daily_food_id')
            creator = serializer.data.get('creator')
            date = serializer.data.get('date')
            meal=serializer.data.get('meal')

            food = UserDailyFood.objects.get(pk=daily_food_id,product_id=product_id,date=date,creator=creator,meal=meal)
            if food!=None:
                food.kcal = (food.kcal*quantity)/food.quantity
                food.proteins= (food.proteins*quantity)/food.quantity
                food.carbs = (food.carbs*quantity)/food.quantity
                food.fats = (food.fats*quantity)/food.quantity
                food.sugars = (food.sugars*quantity)/food.quantity
                food.fibers = (food.fibers*quantity)/food.quantity
                food.quantity = quantity
                food.save()

                return Response({"Found":"Food edited"},status=status.HTTP_200_OK)
            return Response({"Not found":"No product"},status=status.HTTP_404_NOT_FOUND)
        return Response({"Bad request":"Not valid"},status=status.HTTP_400_BAD_REQUEST)

class DeleteDailyFood(APIView):
    serializer_class = DeleteDailyFoodSerializer
    def post(self,request):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            creator = serializer.data.get('creator')
            date = serializer.data.get('date')
            product_id = serializer.data.get('product_id')
            meal= serializer.data.get('meal')
            daily_food_id=serializer.data.get('daily_food_id')

            UserDailyFood.objects.filter(creator = creator,date=date,product_id=product_id,pk=daily_food_id,meal=meal).delete()

            return Response({"Delete request":"The item has been deleted"},status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response({"Bad request":"Erro occured"},status=status.HTTP_400_BAD_REQUEST)

#RECENT FOOD
class AddRecentUserFoods(APIView):
    serializer_class = RecentUserFoodsSerializer
    def post(self,request):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            creator = serializer.data.get('creator')
            product_name=serializer.data.get('product_name')
            grams = serializer.data.get('grams')
            kcal = serializer.data.get('kcal')
            product_id = serializer.data.get('product_id')

            if not RecentUserFoods.objects.filter(product_id=product_id,creator=creator).exists():

                food = RecentUserFoods(creator=creator,product_name=product_name,grams=grams,kcal=kcal,product_id=product_id)
                food.save()

                return Response(RecentUserFoodsSerializer(food).data,status=status.HTTP_201_CREATED)
        return Response({'Bad request':"Try again"},status = status.HTTP_400_BAD_REQUEST)

class GetRecentUserFoods(APIView):
    serializer_class = GetRecentUserFoodsSerializer
    def post(self,request):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            creator = serializer.data.get('creator')
            recent_foods = RecentUserFoods.objects.filter(creator = creator)
            data = RecentUserFoodsSerializer(recent_foods,many = True).data
            if data:
                return Response(data,status= status.HTTP_200_OK)
        return Response({'Bad request':"No recent food"},status = status.HTTP_400_BAD_REQUEST)

#KCAL GOAL
class CreateKcalGoal(APIView):
    serializer_class = KcalGoalSerializer
    def post(self,request):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            creator = serializer.data.get('creator')
            goal = serializer.data.get('goal')
            obj = KcalGoal.objects.filter(creator=creator)
            if obj.exists():
                obj[0].goal=goal
                obj[0].save()
            else:
                obj=KcalGoal(creator = creator,goal=goal)
                obj.save()
            return Response({"OK":"ok"},status=status.HTTP_201_CREATED)
        return Response({'Bad request':"No recent food"},status = status.HTTP_400_BAD_REQUEST)

class GetKcalGoal(APIView):
    serializer_class = GetKcalGoalSerializer
    def post(self,request):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            creator = serializer.data.get('creator')
            queryset = KcalGoal.objects.filter(creator=creator)
            if queryset.exists():
                return Response(KcalGoalSerializer(queryset[0]).data,status=status.HTTP_200_OK)
            return Response({"Not found":"No kcal goal"},status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad request':"No recent food"},status = status.HTTP_400_BAD_REQUEST)
        
        

        
                