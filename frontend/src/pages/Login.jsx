import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import constants from "../constants";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(constants.baseUrl + "api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("userName", data.userName);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(data.detail || "Invalid username or password!");
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
        <h2 className="mb-6 text-center text-2xl font-semibold">Login</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input data-testid="username-input-test" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password data-testid="password-input-test" />
          </Form.Item>
          <Button
            data-testid="login-button-test"
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
          >
            Login
          </Button>
        </Form>
        <div className="mt-4 text-center">
          <p>Don't have an account?</p>
          <Button
            data-testid="register-button-test"
            type="link"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </div>
      </Card>
    </div>
  );
}
