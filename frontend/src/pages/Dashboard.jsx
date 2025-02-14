import React, { useEffect, useState, useRef } from "react";
import { Button, Input, Card, message } from "antd";
import {
  SendOutlined,
  MessageOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import constants from "../constants";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import moment from "moment";

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");

  const [chatOpen, setChatOpen] = useState(true);
  const ws = useRef(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken) {
      const userName = localStorage.getItem("userName");
      setUserName(userName);
      fetch(constants.baseUrl + "api/users/token/verify/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: accessToken }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Invalid token");
          }
        })
        .catch((error) => {
          console.error("Token verification failed:", error);

          toast.error("Token verification failed:" + error);
          if (refreshToken) {
            fetch(constants.baseUrl + "api/users/token/refresh/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken: refreshToken }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.accessToken) {
                  localStorage.setItem("accessToken", data.accessToken);
                } else {
                  toast.error("Session expired. Please login again.");
                  navigate("/login");
                }
              })
              .catch(() => {
                toast.error("Session expired. Please login again.");
                navigate("/login");
              });
          } else {
            navigate("/login");
          }
        });
    } else {
      navigate("/login");
    }

    ws.current = new WebSocket("ws://127.0.0.1:8000/ws/chat/");

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.message) {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", message: data.message, timestamp: data.timestamp },
          ]);
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
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    fetch(constants.baseUrl + "api/users/chat/history/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Assuming data is an array of messages in chronological order
        const formattedMessages = data.map((item) => ({
          sender: item.sender,
          message: item.message,
          timestamp: item.timestamp,
        }));
        setMessages(formattedMessages);
      })
      .catch((error) => {
        if (error.status == 401) {
        }
        console.error("Error fetching chat history:", error);
      });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const sendMessage = () => {
    if (input.trim() === "") return;
    if (ws.current) {
      ws.current.send(
        JSON.stringify({
          message: input,
          sender: userName,
          timestamp: new Date().toISOString(),
        }),
      );
      setMessages((prev) => [...prev, { sender: userName, message: input }]);
      setInput("");
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const formatTimestamp = (isoTimestamp) => {
    const messageTime = moment(isoTimestamp);
    const now = moment();
    // If the message is at least a day old, show how many days ago it was sent
    if (now.diff(messageTime, "days") >= 1) {
      return messageTime.fromNow(); // e.g., "2 days ago"
    } else {
      // Otherwise, show the time (e.g., "3:45 PM")
      return messageTime.format("h:mm A");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-blue-600 p-4 text-center text-xl font-semibold text-white shadow-md">
        <span>Chatbot</span>
        <Button
          type="text"
          onClick={handleLogout}
          classNames="text-white bg-red-600 hover:bg-red-700"
        >
          <span className="text-white">Logout</span>
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-grow space-y-4 p-6">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-2 text-lg font-semibold">Dashboard Overview</h2>
          <p>
            Welcome to your dashboard. Here is some placeholder content to fill
            the space.
          </p>
        </div>
      </main>

      <div className="fixed right-5 bottom-5 flex flex-col items-end">
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ marginBottom: "10px" }}
          >
            <Card className="rounded-lg p-4 shadow-lg">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Chatbot</h3>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => setChatOpen(false)}
                />
              </div>
              <div className="mb-2 h-80 overflow-y-auto rounded-sm border border-gray-300 p-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      msg.sender === userName ? "items-end" : "items-start"
                    } mb-2`}
                  >
                    <div
                      className={`relative max-w-xs rounded-xl px-3 py-2 break-all ${
                        msg.sender === userName
                          ? "rounded-br-none bg-blue-500 text-white"
                          : "rounded-bl-none bg-gray-300 text-black"
                      }`}
                    >
                      {msg.message}
                    </div>
                    <div className="text-xs text-black">
                      {formatTimestamp(msg.timestamp)}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="flex items-end gap-2">
                <Input.TextArea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onPressEnter={sendMessage}
                  placeholder="Type a message..."
                  autoSize={{ minRows: 1, maxRows: 10 }} // auto-resizing vertically
                  className="w-full"
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={sendMessage}
                />
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
