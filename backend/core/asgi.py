import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from chatbot.routing import websocket_urlpatterns  # ✅ Import WebSocket routes


application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": URLRouter(websocket_urlpatterns),  # ✅ WebSocket handling
})