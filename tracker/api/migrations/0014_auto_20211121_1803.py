# Generated by Django 3.1.7 on 2021-11-21 16:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_auto_20211121_1314'),
    ]

    operations = [
        migrations.AddField(
            model_name='products',
            name='fibers',
            field=models.FloatField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='products',
            name='sugars',
            field=models.FloatField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userdailyfood',
            name='fibers',
            field=models.FloatField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userdailyfood',
            name='sugars',
            field=models.FloatField(default=0),
            preserve_default=False,
        ),
    ]
