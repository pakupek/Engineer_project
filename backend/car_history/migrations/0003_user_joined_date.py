# Generated by Django 4.2.20 on 2025-05-12 15:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('car_history', '0002_remove_user_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='joined_date',
            field=models.DateField(null=True),
        ),
    ]
