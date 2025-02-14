# tests/test_chat_consumer.py
import json
from channels.testing import WebsocketCommunicator
from channels.db import database_sync_to_async
from django.test import TransactionTestCase  # supports async tests
from chatbot.consumers import ChatConsumer
from chatbot.models import ChatMessage

class ChatConsumerTests(TransactionTestCase):
    async def test_connection_and_echo(self):
        # Create a communicator for the consumer at the desired path
        communicator = WebsocketCommunicator(ChatConsumer.as_asgi(), "/ws/chat/")
        connected, _ = await communicator.connect()
        self.assertTrue(connected, "Failed to connect to the websocket consumer.")

        # Receive the connection message
        response = await communicator.receive_from()
        data = json.loads(response)
        self.assertIn("WebSocket Connected!", data["message"])

        # Send a test message and check that it is echoed back
        test_message = "Hello, World!"
        await communicator.send_to(text_data=json.dumps({"message": test_message}))
        response = await communicator.receive_from()
        data = json.loads(response)
        self.assertEqual(data["message"], "'"+ test_message+"'" +' recieved as message.')

        await communicator.disconnect()

    async def test_save_messages(self):
        # Clear existing ChatMessage objects in the test database
        await database_sync_to_async(ChatMessage.objects.all().delete)()

        communicator = WebsocketCommunicator(ChatConsumer.as_asgi(), "/ws/chat/")
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        test_message = "WebSocket Connected!"
        await communicator.send_to(text_data=json.dumps({"message": test_message}))
        response = await communicator.receive_from()
        data = json.loads(response)
        print(data)
        self.assertEqual(data["message"], test_message)

        await communicator.disconnect()

        # Retrieve all ChatMessage objects from the test database
        messages = await database_sync_to_async(list)(ChatMessage.objects.all())
        # The consumer should have saved two messages: one for the user and one for the bot
        self.assertEqual(len(messages), 2, "Expected 2 messages saved in the database.")
        user_msg = messages[0]
        bot_msg = messages[1]
        self.assertEqual(user_msg.sender, "anonymous")
        self.assertEqual(bot_msg.sender, "bot")
        self.assertEqual(user_msg.message, test_message)
        self.assertEqual(bot_msg.message,  "'"+ test_message+"'" +' recieved as message.')
