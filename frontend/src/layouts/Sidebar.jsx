import React, { useEffect } from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  UserOutlined,
  DatabaseOutlined, // Inventory icon
} from "@ant-design/icons";
import { LogoL } from "../assets";
import { Link } from "react-router-dom";

const Sidebar = () => {
  let path = window.location.pathname;

  useEffect(() => {}, []);

  const selectedKey = () => {
    if (path === "/sweet") return "1";
    if (path === "/users") return "2";
    if (path === "/inventory") return "3";
    return "1";
  };

  return (
    <>
      <div className="flex flex-col w-full justify-center items-center py-4 bg-[#EBEBEB]">
        <img src={LogoL} alt="logo" className="w-16" />
      </div>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={[selectedKey()]}
        className="text-base font-normal text-black bg-[#EBEBEB]"
        items={[
          {
            key: "1",
            icon: <AppstoreOutlined />,
            label: <Link to="/sweet">Sweet</Link>,
          },
          {
            key: "2",
            icon: <UserOutlined />,
            label: <Link to="/users">User</Link>,
          },
          {
            key: "3",
            icon: <DatabaseOutlined />,
            label: <Link to="/inventory">Inventory</Link>,
          },
        ]}
      />
    </>
  );
};

export default Sidebar;
