# Generated by Django 3.1.7 on 2022-01-27 08:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('strava', '0016_auto_20220126_1616'),
    ]

    operations = [
        migrations.AddField(
            model_name='stravatoken',
            name='user_id',
            field=models.CharField(default='', max_length=200),
            preserve_default=False,
        ),
    ]
