
from django.urls import path
from .views import *

urlpatterns = [
    path('get-all-products',GetProducts.as_view()),
    path('add-product',AddProduct.as_view()),
    path('add-daily-food',AddDailyFood.as_view()),
    path('get-daily-food',GetDailyUserFood.as_view()),
    path('add-recent-food',AddRecentUserFoods.as_view()),
    path('get-recent-food',GetRecentUserFoods.as_view()),
    path('product-details',ProductDetails.as_view()),
    path("search-food",SearchFood.as_view()),
    path("edit-food",EditDailyFood.as_view()),
    path("delete-food",DeleteDailyFood.as_view()),
    path("set-kcal-goal",CreateKcalGoal.as_view()),
    path("get-kcal-goal",GetKcalGoal.as_view()),
]