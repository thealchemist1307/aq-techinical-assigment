from django.urls import path
from chatbot.consumers import ChatConsumer

websocket_urlpatterns = [
    path("ws/chat/", ChatConsumer.as_asgi()),  # ✅ WebSocket route
]