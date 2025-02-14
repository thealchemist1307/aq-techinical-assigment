from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from chatbot.models import ChatMessage

class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        username = request.user.username  # Assuming the user is authenticated and the username matches the one used in the conversation
        # Retrieve all chat messages where sender matches the user's username
        messages = ChatMessage.objects.filter(chat_id=username).order_by('timestamp')
        data = [
            {
                "sender": msg.sender,
                "message": msg.message,
                "timestamp": msg.timestamp.isoformat()
            }
            for msg in messages
        ]
        return Response(data)
# User Registration API
class RegisterView(APIView):
    permission_classes = [AllowAny]  #Ensure this is set

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# User Login API (JWT Token Generation)
class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refreshToken": str(refresh),
                "accessToken": str(refresh.access_token),
                "userName":username
            })
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# Protected View to Test JWT Authentication
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "You have access!"})
    

class GetAccessTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refreshToken")

        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            return Response({"accessToken": access_token}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)