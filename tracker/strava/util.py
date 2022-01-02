from .models import StravaToken,UserDetails
from django.utils import timezone
from datetime import timedelta
from requests import post,put,get
from django.conf import settings



BASE_URL = "https://www.strava.com/api/v3/athlete/"
def get_user_tokens(session_id):
    user_tokens = StravaToken.objects.filter(user = session_id)
    if user_tokens.exists():
        return user_tokens[0]
    return None

def get_user_details(user_id,username,first_name,last_name,city,country,sex,premium_account,weight,profile_pic):
    user_details=UserDetails.objects.filter(user_id=user_id)
    if user_details.exists():
        user_details = user_details[0]
        user_details.username=username
        user_details.last_name=last_name
        user_details.first_name=first_name
        user_details.city=city
        user_details.country=country
        user_details.sex = sex
        user_details.premium_account=premium_account
        user_details.weight=weight
        user_details.profile_pic=profile_pic
        user_details.save()
    else:
        user_details = UserDetails(user_id=user_id, username=username,first_name=first_name,last_name=last_name,
        city=city, country=country,sex=sex,premium_account=premium_account,weight=weight,profile_pic=profile_pic)

        user_details.save()
    return user_details

def update_or_create_user_tokens(session_id,access_token,token_type,expires_in,refresh_token):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)
    
    if tokens:
        tokens.access_token =access_token
        tokens.token_type = token_type
        tokens.expires_in = expires_in
        tokens.refresh_token = refresh_token
        tokens.save(update_fields=['access_token','token_type','expires_in','refresh_token'])
    else:
        tokens = StravaToken(user = session_id,access_token=access_token,refresh_token=refresh_token,token_type=token_type,expires_in=expires_in)
        tokens.save()

def is_strava_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry=tokens.expires_in

        if expiry<=timezone.now():
            refresh_strava_token(session_id)
        return True
    return False

def refresh_strava_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token
    response = post("https://www.strava.com/oauth/token",data={
        'grant_type':'refresh_token',
        'refresh_token':refresh_token,
        'client_id':settings.CLIENT_ID,
        'client_secret':settings.CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)

