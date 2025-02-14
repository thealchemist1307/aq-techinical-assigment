from django.db import models
from django.utils import timezone

class ChatMessage(models.Model):
    SENDER_CHOICES = [
        ('user', 'User'),
        ('bot', 'Bot'),
    ]
    chat_id=models.TextField(default='bot', blank=True, null=True)
    sender = models.TextField(choices=SENDER_CHOICES,default='bot')
    message = models.TextField(default='Message')
    timestamp = models.DateTimeField(default=timezone.now)  # We'll set this manually

    def __str__(self):
        return f"{self.sender}: {self.message[:20]} at {self.timestamp}"
