# Generated by Django 3.1.7 on 2021-11-05 17:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('strava', '0003_activity'),
    ]

    operations = [
        migrations.AddField(
            model_name='activity',
            name='user_key',
            field=models.CharField(default='', max_length=50, unique=True),
            preserve_default=False,
        ),
    ]
