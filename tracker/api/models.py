from django.db import models

# Create your models here.

class Products(models.Model):
    product = models.CharField(max_length=200)
    product_id=models.CharField(max_length=200,blank=True,null=True)
    quantity=models.FloatField()
    kcal=models.FloatField()
    proteins=models.FloatField()
    carbs=models.FloatField()
    fats=models.FloatField()
    sugars = models.FloatField()
    fibers = models.FloatField()

class UserDailyFood(models.Model):
    creator=models.CharField(max_length=200)
    meal = models.CharField(max_length=200)
    product_name=models.CharField(max_length=200)
    product_id = models.CharField(max_length=200,null=True,blank=True)
    date = models.DateTimeField(blank=True,null=True)
    quantity=models.FloatField()
    kcal=models.FloatField()
    proteins=models.FloatField()
    carbs=models.FloatField()
    fats=models.FloatField()
    sugars = models.FloatField()
    fibers = models.FloatField()

class RecentUserFoods(models.Model):
    creator=models.CharField(max_length=200)
    product_name=models.CharField(max_length=200)
    product_id = models.CharField(max_length=200,null=True,blank=True)
    grams = models.FloatField()
    kcal=models.FloatField()
    proteins=models.FloatField()
    carbs=models.FloatField()
    fats=models.FloatField()
    sugars = models.FloatField()
    fibers = models.FloatField()
    
class KcalGoal(models.Model):
    creator=models.CharField(max_length=200)
    goal = models.IntegerField()
    # proteins = models.IntegerField()
    # carbs = models.IntegerField()
    # fibers = models.IntegerField()

