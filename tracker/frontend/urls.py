from django.urls import path
from .views import *

app_name="frontend"
urlpatterns = [
    path('',index,name="home"),
    path('profile',index,name="profile"),
    path('create-activity',index,name='create-activity'),
    path('activities',index,name="activities"),
    path('activity-details/<str:id>',index,name='activity-details'),
    path('update-activity/<str:id>',index,name="update-activity"),
    path('daily-calories/<str:user_id>/<str:date>',index,name='daily-calories'),
    path('add-food/<str:time>/<str:user_id>/<str:date>',index,name='add-food'),
    path('create-food/<str:user_id>',index,name='create-food'),
    # path('edit-daily-food/<str:time>/<str:product_id>/<str:user_id>/<str:daily_food_id>',index,name="edit-daily-food"),
    path('set-kcal-goal/<str:user_id>',index),
]