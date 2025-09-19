// src/pages/SignUp.jsx
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { LogoL } from "../assets";
import { useContentContext } from "../providers/ContentContext";

const SignUp = () => {
  const { openSuccessNotification } = useContentContext();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      openSuccessNotification("Account Created!", "You can now log in");
      window.location.replace("/login");
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center bg-[#ececec]">
      <div className="flex flex-col justify-center items-center">
        <img src={LogoL} alt="Logo" className="w-16" />
        <div className="text-2xl font-semibold mt-2">SMS-dashboard</div>
      </div>

      <div className="flex flex-col justify-center items-center mt-4 bg-white p-6 sm:px-8 px-4 max-sm:mx-2 rounded-2xl shadow-xl">
        <div className="text-lg font-medium">Sign Up</div>

        <Form
          name="signup"
          className="flex flex-col sm:w-[300px] w-[250px] mt-4"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter your Name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter your Email!" }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your Password!" }]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="w-full bg-blue-500 mt-4">
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-4 text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Log In</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
