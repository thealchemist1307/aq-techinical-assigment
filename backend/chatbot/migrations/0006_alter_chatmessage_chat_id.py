# Generated by Django 5.1.6 on 2025-02-14 14:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatbot', '0005_alter_chatmessage_timestamp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatmessage',
            name='chat_id',
            field=models.TextField(blank=True, default='bot', null=True),
        ),
    ]
