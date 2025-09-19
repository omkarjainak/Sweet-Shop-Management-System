// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import { LogoL } from "../assets";
import { useContentContext } from "../providers/ContentContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { openSuccessNotification } = useContentContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.username,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);

      openSuccessNotification("Login Success!", "Successfully Logged In");
      window.location.replace("/sweet");
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.replace("/sweet");
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center bg-[#ececec] relative">
     {/* Home Button */}
      <Button
      type="default"
      icon={<HomeOutlined />}
      onClick={() => navigate("/")}
      className="
      absolute top-4 left-4
      flex items-center gap-1
      bg-white text-blue-600
      border border-gray-300
      shadow-md
      hover:bg-blue-50 hover:text-blue-700
      transition-all duration-200
      rounded-lg
      px-3 py-1
    "
    >
    Home
   </Button>


      <div className="flex flex-col justify-center items-center">
        <img src={LogoL} alt="Logo" className="w-16" />
        <div className="text-2xl font-semibold mt-2">SMS-dashboard</div>
      </div>

      <div className="flex flex-col justify-center items-center mt-4 bg-white p-6 sm:px-8 px-4 max-sm:mx-2 rounded-2xl shadow-xl">
        <div className="text-lg font-medium">Log In</div>

        <Form
          name="normal_login"
          className="flex flex-col sm:w-[300px] w-[250px] mt-4"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, type: "email", message: "Please enter your Email!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your Password!" }]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-blue-500 mt-4"
            >
              Log in
            </Button>
          </Form.Item>

          <div className="mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
