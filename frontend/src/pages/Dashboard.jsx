import React, { useEffect, useState, useRef } from "react";
import { Button, Input, Card, message } from "antd";
import { SendOutlined, MessageOutlined,CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatOpen, setChatOpen] = useState(true);
  const ws = useRef(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken) {
      if (refreshToken) {
        fetch("http://127.0.0.1:8000/api/token/refresh/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: refreshToken }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.accessToken) {
              localStorage.setItem("accessToken", data.accessToken);
            } else {
              message.error("Session expired. Please login again.");
              navigate("/login");
            }
          })
          .catch(() => {
            message.error("Session expired. Please login again.");
            navigate("/login");
          });
      } else {
        navigate("/login");
      }
      return;
    }

    ws.current = new WebSocket("ws://127.0.0.1:8000/ws/chat/");

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data)
        if (data.message) {
          setMessages((prev) => [...prev, { sender: "bot", text: data.message }]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.current.onclose = () => console.log("WebSocket Disconnected");

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    if (ws.current) {
      ws.current.send(JSON.stringify({ message: input }));
      setMessages((prev) => [...prev, { sender: "user", text: input }]);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md text-center text-xl font-semibold">
        Chatbot
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 space-y-4">
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Dashboard Overview</h2>
          <p>Welcome to your dashboard. Here is some placeholder content to fill the space.</p>
        </div>
      </main>



         <div className="fixed bottom-5 right-5 flex flex-col items-end">
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Card >
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Chatbot</h3>
                <Button type="text" icon={<CloseOutlined />} onClick={() => setChatOpen(false)} />
              </div>
              <div className="h-64 overflow-y-auto border border-gray-300 rounded-sm p-2 mb-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-1`}
                  >
                    <span
                      className={`px-3 py-1 rounded-lg max-w-xs break-words ${
                        msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                      }`}
                    >
                      {msg.text}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onPressEnter={sendMessage}
                  placeholder="Type a message..."
                />
                <Button type="primary" icon={<SendOutlined />} onClick={sendMessage} />
              </div>
            </Card>
          </motion.div>
        )}
        <Button
          type="primary"
          shape="circle"
          icon={<MessageOutlined />}
          size="large"
          onClick={() => setChatOpen(!chatOpen)}
          className="shadow-lg"
        />
        </div>
    </div>
  );
}
