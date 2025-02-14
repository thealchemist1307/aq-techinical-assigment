import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import constants from "../constants";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(constants.baseUrl + "api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Registration successful! Please log in.");
        navigate("/login");
      } else {
        toast.error(data.detail || "Registration failed!");
      }
    } catch (error) {
      toast.error("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md rounded-lg p-6 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold">Register</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
          >
            Register
          </Button>
        </Form>
        <div className="mt-4 text-center">
          <p>Already have an account?</p>
          <Button type="link" onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      </Card>
    </div>
  );
}
