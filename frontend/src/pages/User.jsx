import React, { useEffect, useState } from "react";
import { Table, Select, message, Card } from "antd";
import { getToken, getUserRole } from "../utils/auth";

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = getToken();
  const role = getUserRole();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      setUsers(data);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update role");
      message.success("Role updated successfully!");
      fetchUsers();
    } catch (err) {
      message.error(err.message);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text, record) =>
        role === "superadmin" ? (
          <Select
            value={record.role}
            onChange={(value) => handleRoleChange(record.id, value)}
            style={{ width: 150 }}
          >
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
            <Option value="superadmin">Superadmin</Option>
          </Select>
        ) : (
          record.role
        ),
    },
  ];

  return (
    <Card className="shadow-lg p-4">
      <h2 className="text-2xl font-semibold mb-4">Users Management</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default Users;
