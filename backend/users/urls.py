from django.urls import path
from .views import RegisterView, LoginView, ProtectedView,GetAccessTokenView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("protected/", ProtectedView.as_view(), name="protected"),
        path('token/refresh/', GetAccessTokenView.as_view(), name='token_refresh'),

]