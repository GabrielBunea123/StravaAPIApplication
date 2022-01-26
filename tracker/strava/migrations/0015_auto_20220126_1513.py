# Generated by Django 3.1.7 on 2022-01-26 13:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('strava', '0014_auto_20220126_1512'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='activity_id',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='activity',
            name='activity_type',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='activity',
            name='distance',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='activity',
            name='elapsed_time',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='activity',
            name='start_date_local',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]