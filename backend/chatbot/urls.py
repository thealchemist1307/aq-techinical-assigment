from django.urls import path
from chatbot.views import chat_view

urlpatterns = [
    path("", chat_view, name="chat"),
]
