
from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', strava_callback),
    path('is_authenticated',IsAuthenticated.as_view()),
    path('authenticated-user',AuthenticatedUser.as_view()),
    path('user-stats',GetUserStats.as_view()),
    path('create-activity',CreateActivity.as_view()),
    path('get-strava-activities',GetStravaActivities.as_view()),
    path('get-one-strava-activity',GetOneStravaActivity.as_view()),
    path('update-activity',UpdateActivity.as_view()),
    path('get-route',GetRoute.as_view()),
]