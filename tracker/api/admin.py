from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Products)
admin.site.register(UserDailyFood)
admin.site.register(KcalGoal)
admin.site.register(RecentUserFoods)