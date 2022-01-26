# Generated by Django 3.1.7 on 2022-01-26 10:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('strava', '0009_auto_20211116_1834'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserStats',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.CharField(blank=True, max_length=200, null=True)),
                ('all_run_totals_count', models.IntegerField(blank=True, null=True)),
                ('all_run_totals_distance', models.IntegerField(blank=True, null=True)),
                ('all_run_totals_moving_time', models.IntegerField(blank=True, null=True)),
                ('all_ride_totals_count', models.IntegerField(blank=True, null=True)),
                ('all_ride_totals_distance', models.IntegerField(blank=True, null=True)),
                ('all_ride_totals_moving_time', models.IntegerField(blank=True, null=True)),
                ('all_swim_totals_count', models.IntegerField(blank=True, null=True)),
                ('all_swim_totals_distance', models.IntegerField(blank=True, null=True)),
                ('all_swim_totals_moving_time', models.IntegerField(blank=True, null=True)),
                ('biggest_ride_distance', models.IntegerField(blank=True, null=True)),
            ],
        ),
        migrations.RenameField(
            model_name='activity',
            old_name='user_key',
            new_name='user_id',
        ),
        migrations.AddField(
            model_name='activity',
            name='lat',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='activity',
            name='long',
            field=models.FloatField(blank=True, null=True),
        ),
    ]