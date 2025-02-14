import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from chatbot.models import ChatMessage

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        current_time = timezone.now().isoformat()
        await self.send(text_data=json.dumps({
            'sender': 'bot',
            "message": "WebSocket Connected!",
            "timestamp": current_time
        }))

    async def disconnect(self, close_code):
        print(f"WebSocket disconnected with code: {close_code}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)
        # Expect the frontend to send the sender as the username
        sender = data.get("sender", "anonymous")
        message = data.get("message", "")

        # Save the user's message with current timestamp
        user_timestamp = data.get("timestamp", "")
        await self.save_message(sender,sender, message, user_timestamp)

        # Bot response logic (here, echoing back the message)
        bot_response ="'"+ message+"'" +' recieved as message.' # Replace with more complex logic if needed
        bot_timestamp = timezone.now()

        # Save the bot's response using the same username so that the entire conversation is tied to that user
        await self.save_message(sender,'bot', bot_response, bot_timestamp)

        # Send the bot's response (and timestamp) back to the client
        await self.send(text_data=json.dumps({
            "sender": "bot",
            "message": bot_response,
            "timestamp": bot_timestamp.isoformat(),
            
        }))

    @database_sync_to_async
    def save_message(self,chat_id, sender, message, timestamp):
        if not timestamp:
            timestamp = timezone.now()
        return ChatMessage.objects.create(chat_id=chat_id,sender=sender, message=message, timestamp=timestamp)
