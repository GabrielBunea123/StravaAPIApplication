from django.db import models

# Create your models here.
class StravaToken(models.Model):
    user = models.CharField(max_length=50,unique=True)
    user_id = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=200)
    access_token = models.CharField(max_length=200)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)

class UserDetails(models.Model):
    user_id = models.IntegerField()
    username = models.CharField(max_length=200,blank=True,null=True)
    firstname = models.CharField(max_length=200,blank=True,null=True)
    lastname = models.CharField(max_length=200,blank=True,null=True)
    followers = models.IntegerField(blank=True,null=True)
    city = models.CharField(max_length=200,blank=True,null=True)
    country = models.CharField(max_length=200,blank=True,null=True)
    sex = models.CharField(max_length=200,blank=True,null=True)
    premium_account = models.BooleanField(default=False,blank=True,null=True)
    profile_pic = models.CharField(max_length=200,null=True,blank=True)
    weight = models.FloatField(null=True,blank=True)

class UserStats(models.Model):

    user_id = models.CharField(max_length=200,blank=True,null=True)

    all_run_totals_count = models.IntegerField(blank=True,null=True)
    all_run_totals_distance = models.IntegerField(blank=True,null=True)
    all_run_totals_moving_time = models.IntegerField(blank=True,null=True)

    all_ride_totals_count = models.IntegerField(blank=True,null=True)
    all_ride_totals_distance = models.IntegerField(blank=True,null=True)
    all_ride_totals_moving_time = models.IntegerField(blank=True,null=True)

    all_swim_totals_count = models.IntegerField(blank=True,null=True)
    all_swim_totals_distance = models.IntegerField(blank=True,null=True)
    all_swim_totals_moving_time = models.IntegerField(blank=True,null=True)

    biggest_ride_distance = models.IntegerField(blank=True,null=True)


class Activity(models.Model):
    user_id = models.CharField(max_length=200,blank=True,null=True)
    activity_id = models.IntegerField(blank=True,null=True)
    name = models.CharField(max_length=200,blank=True)
    activity_type = models.CharField(max_length=200,blank=True,null=True)
    start_date_local = models.DateTimeField(auto_now_add=True,blank=True,null=True)
    elapsed_time = models.IntegerField(blank=True,null=True)
    distance = models.IntegerField(blank=True,null=True)
    calories = models.FloatField(blank=True,null=True)
    speed = models.FloatField(blank=True, null=True)
    polyline = models.CharField(max_length=10000000000000000000000000,blank=True,null=True)
    
