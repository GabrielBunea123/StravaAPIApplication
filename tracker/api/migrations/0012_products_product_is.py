# Generated by Django 3.1.7 on 2021-11-21 11:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_recentuserfoods_product_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='products',
            name='product_is',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
