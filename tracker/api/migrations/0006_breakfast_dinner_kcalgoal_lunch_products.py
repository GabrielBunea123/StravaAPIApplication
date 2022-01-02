# Generated by Django 3.1.7 on 2021-11-18 04:42

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('api', '0005_auto_20211105_1025'),
    ]

    operations = [
        migrations.CreateModel(
            name='Breakfast',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creator', models.CharField(max_length=200)),
                ('product_name', models.CharField(max_length=200)),
                ('quantity', models.FloatField()),
                ('kcal', models.IntegerField()),
                ('proteins', models.FloatField()),
                ('carbs', models.FloatField()),
                ('fats', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Dinner',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creator', models.CharField(max_length=200)),
                ('product_name', models.CharField(max_length=200)),
                ('quantity', models.FloatField()),
                ('kcal', models.IntegerField()),
                ('proteins', models.FloatField()),
                ('carbs', models.FloatField()),
                ('fats', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='KcalGoal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('goal', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Lunch',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creator', models.CharField(max_length=200)),
                ('product_name', models.CharField(max_length=200)),
                ('quantity', models.FloatField()),
                ('kcal', models.IntegerField()),
                ('proteins', models.FloatField()),
                ('carbs', models.FloatField()),
                ('fats', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Products',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product', models.CharField(max_length=200)),
            ],
        ),
    ]