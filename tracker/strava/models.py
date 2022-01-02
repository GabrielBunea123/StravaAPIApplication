from django.db import models

# Create your models here.
class StravaToken(models.Model):
    user = models.CharField(max_length=50,unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=200)
    access_token = models.CharField(max_length=200)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)

class UserDetails(models.Model):
    user_id = models.IntegerField()
    username = models.CharField(max_length=200,blank=True,null=True)
    first_name = models.CharField(max_length=200,blank=True,null=True)
    last_name = models.CharField(max_length=200,blank=True,null=True)
    city = models.CharField(max_length=200,blank=True,null=True)
    country = models.CharField(max_length=200,blank=True,null=True)
    sex = models.CharField(max_length=200,blank=True,null=True)
    premium_account = models.BooleanField(default=False,blank=True,null=True)
    profile_pic = models.CharField(max_length=200,null=True,blank=True)
    weight = models.FloatField()
class Activity(models.Model):
    user_key = models.CharField(max_length=50)
    activity_id = models.IntegerField()
    name = models.CharField(max_length=200,blank=True)
    activity_type = models.CharField(max_length=200,blank=True)
    start_date_local = models.DateTimeField(auto_now_add=True)
    elapsed_time = models.IntegerField()
    description = models.CharField(max_length=200)
    distance = models.IntegerField()
    
