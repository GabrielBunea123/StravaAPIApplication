# Generated by Django 3.1.7 on 2021-11-16 16:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('strava', '0006_auto_20211106_1747'),
    ]

    operations = [
        migrations.AddField(
            model_name='userdetails',
            name='profile_pic',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
    ]
