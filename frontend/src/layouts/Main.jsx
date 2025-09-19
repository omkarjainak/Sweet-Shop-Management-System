import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { Layout, Button, Dropdown } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { Route, Routes } from "react-router-dom";

import Sidebar from "./Sidebar";
import { Users ,Sweet, Inventory} from "../pages";
import { useContentContext } from "../providers/ContentContext";
import { getUserRole } from "../utils/auth";

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState("user");
  const { openSuccessNotification } = useContentContext();

  useEffect(() => {
    if (window.innerWidth < 426) setCollapsed(true);
    const userRole = getUserRole();
    if (userRole) setRole(userRole);
  }, []);

  const menuProps = {
    items: [
      {
        label: "Logout",
        key: "1",
        icon: <PoweroffOutlined />,
        onClick: () => {
          openSuccessNotification("Logged Out!", "Logout Success!");
          localStorage.clear();
          window.location.replace("/login");
        },
      },
    ],
  };

  return (
    <Layout className="h-screen w-full flex flex-row">
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        trigger={null}
        style={{ background: "#EBEBEB" }}
      >
        <Sidebar role={role} />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: "white" }}>
          <div className="flex flex-row items-center justify-between">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16, width: 64, height: 64, zIndex: 999 }}
            />
            <Dropdown.Button
              menu={menuProps}
              icon={<UserOutlined />}
              className="flex justify-end m-4"
            >
              Hello, {role.charAt(0).toUpperCase() + role.slice(1)}!
            </Dropdown.Button>
          </div>
        </Header>

        <Content className="m-[24px] p-[24px] bg-white rounded-md h-full overflow-scroll">
          <Routes>
            <Route path="/" element={<Sweet />} />
            <Route path="/users" element={<Users />} />
            <Route path="/sweet" element={<Sweet />} />
            <Route path="/inventory" element={<Inventory />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Main;
