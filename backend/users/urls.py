from django.urls import path
from .views import RegisterView, LoginView, ProtectedView,GetAccessTokenView,ChatHistoryView
from rest_framework_simplejwt.views import TokenVerifyView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("protected/", ProtectedView.as_view(), name="protected"),
    path('token/refresh/', GetAccessTokenView.as_view(), name='token_refresh'),
    path('chat/history/', ChatHistoryView.as_view(), name='chat_history'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),



]