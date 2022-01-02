from django.shortcuts import render, redirect
from rest_framework.views import APIView
from requests import Request, post
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from .util import *
from .serializers import *
import json
from datetime import datetime
# Create your views here.
class AuthURL(APIView):
    def get(self,request,format=None):
        scopes = 'read,read_all,profile:read_all,profile:write,activity:read,activity:read_all,activity:write'
        url = Request('GET', 'https://www.strava.com/oauth/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': 'http://127.0.0.1:8000/strava/redirect',
            'client_id': settings.CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)

def strava_callback(request,format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://www.strava.com/oauth/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': settings.CLIENT_ID,
        'client_secret': settings.CLIENT_SECRET,
        'redirect_uri': 'http://127.0.0.1:8000/strava/redirect',
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('frontend:home')


class IsAuthenticated(APIView):
    def get(self,request):
        is_authenticated = is_strava_authenticated(self.request.session.session_key)
        return Response({'status':is_authenticated},status=status.HTTP_200_OK)

class AuthenticatedUser(APIView):
    def get(self,request):
        is_authenticated = is_strava_authenticated(self.request.session.session_key)
        if is_authenticated:
            user = StravaToken.objects.get(user= self.request.session.session_key)

            headers = {'Content-Type': 'application/json',
                       'Authorization': "Bearer " + user.access_token}

            response = get("https://www.strava.com/api/v3/athlete", {}, headers=headers).json()#this is where we got the user details from
            user_id = response.get('id')
            username =response.get('username')
            first_name = response.get('firstname')
            last_name = response.get('lastname')
            city = response.get('city')
            country = response.get('country')
            sex = response.get('sex')
            premium_account = response.get('premium')
            weight = response.get('weight')
            profile_pic = response.get('profile')


            return Response(response,status=status.HTTP_200_OK)
        return Response({'url':is_authenticated},status=status.HTTP_404_NOT_FOUND)

class GetUserStats(APIView):
    def get(self,request,format=None):
        user = StravaToken.objects.get(user= self.request.session.session_key)

        headers = {'Content-Type': 'application/json',
                       'Authorization': "Bearer " + user.access_token}

        response = get("https://www.strava.com/api/v3/athlete", {}, headers=headers).json()
        stats =get(f"https://www.strava.com/api/v3/athletes/{response.get('id')}/stats",{},headers=headers).json()

        return Response(stats,status=status.HTTP_200_OK)

class CreateActivity(APIView):
    serializer_class = CreateActivitySerializer
    def post(self,request,format=None):
        serializer = self.serializer_class(data=request.data)
        user = StravaToken.objects.get(user= self.request.session.session_key)
        headers = {'Authorization': "Bearer " + user.access_token}

        if serializer.is_valid():
            response=post("https://www.strava.com/api/v3/activities",data={
                'name':serializer.data.get('name'),
                'type':serializer.data.get('activity_type'),
                'start_date_local':datetime.now().isoformat(),
                'elapsed_time':serializer.data.get('elapsed_time'),
                'description':serializer.data.get('description'),
                'distance':serializer.data.get('distance'),
                'trainer':0,
                'commute':0,
                'hide_from_home':False,
            },headers=headers).json()
            
            return Response(response, status=status.HTTP_201_CREATED)
        return Response({"Bad request":"Try again"},status=status.HTTP_400_BAD_REQUEST)

class GetStravaActivities(APIView):
    def get(self,request,format=None):
        user = StravaToken.objects.get(user= self.request.session.session_key)
        response =get("https://www.strava.com/api/v3/athlete/activities",headers={'Authorization': "Bearer " + user.access_token}).json()
        return Response(response,status=status.HTTP_200_OK)

class GetOneStravaActivity(APIView):
    serializer_class = GetOneStravaActivitySerializer
    def post(self,request,format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = StravaToken.objects.get(user= self.request.session.session_key)
            response=get(f"https://www.strava.com/api/v3/activities/{serializer.data.get('activity_id')}",{},headers={'Authorization': "Bearer " + user.access_token}).json()

            return Response(response,status=status.HTTP_200_OK)
        return Response({"Not found":"The activity doesn't exist"},status=status.HTTP_404_NOT_FOUND)


class UpdateActivity(APIView):
    serializer_class = GetActivitySerializer
    def put(self,request,format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            activity_id = serializer.data.get("activity_id")
            user = StravaToken.objects.get(user= self.request.session.session_key)
            response=put(f"https://www.strava.com/api/v3/activities/{activity_id}",data={
                'name':serializer.data.get('name'),
                'type':serializer.data.get('activity_type'),
                'elapsed_time':serializer.data.get('elapsed_time'),
                'description':serializer.data.get('description'),
                'distance':serializer.data.get('distance'),
            },headers={'Authorization': "Bearer " + user.access_token}).json()

            return Response(response,status=status.HTTP_200_OK)
        return Response({"Bad request":"Try again"},status=status.HTTP_400_BAD_REQUEST)

class GetRoute(APIView):
    serializer_class = GetRouteSerializer
    def post(self,request,format=None):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = StravaToken.objects.get(user= self.request.session.session_key)
            response = get(f"https://www.strava.com/api/v3/routes/{serializer.data.get('route_id')}",{},headers={'Authorization': "Bearer " + user.access_token})  
            
            return Response(response,status=status.HTTP_200_OK)
        return Response({"Bad request":"Try again"},status=status.HTTP_400_BAD_REQUEST)