import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, InputNumber, Card, message, Space } from "antd";
import { getToken, getUserRole } from "../utils/auth";

const Inventory = () => {
  const token = getToken();
  const role = getUserRole(); // user, admin, superadmin

  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restockQty, setRestockQty] = useState({}); // qty per sweet

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const blueButtonStyle = {
    backgroundColor: "#1890ff",
    borderColor: "#1890ff",
    color: "#fff",
  };

  const canRestock = role === "admin" || role === "superadmin";

  // Fetch sweets
  const fetchSweets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/sweets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch sweets");

      setSweets(data.sort((a, b) => a.id - b.id));
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  // Handle restock
  const handleRestock = async (sweetId) => {
    const quantity = restockQty[sweetId];
    if (!quantity || quantity <= 0) return message.warning("Enter a valid quantity");

    try {
      const res = await fetch(`http://localhost:5000/api/sweets/${sweetId}/restock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Restock failed");

      message.success("Restock successful!");
      setRestockQty((prev) => ({ ...prev, [sweetId]: 0 }));
      fetchSweets();
    } catch (err) {
      message.error(err.message);
    }
  };

  const paginatedData = sweets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Name", dataIndex: "name", key: "name", width: 150 },
    { title: "Category", dataIndex: "category", key: "category", width: 120 },
    { title: "Price", dataIndex: "price", key: "price", width: 80 },
    { title: "Quantity", dataIndex: "quantity", key: "quantity", width: 80 },
    {
      title: "Restock",
      key: "restock",
      width: 200,
      render: (_, record) =>
        canRestock ? (
          <Space>
            <InputNumber
              min={1}
              value={restockQty[record.id] || 0}
              onChange={(value) =>
                setRestockQty((prev) => ({ ...prev, [record.id]: value }))
              }
            />
            <Button style={blueButtonStyle} onClick={() => handleRestock(record.id)}>
              Restock
            </Button>
          </Space>
        ) : null,
    },
  ];

  return (
    <Card className="shadow-lg p-4">
      <h2 className="text-2xl font-semibold mb-4">Inventory Management</h2>
      <Table
        columns={columns}
        dataSource={paginatedData}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total: sweets.length,
          onChange: (page) => setCurrentPage(page),
          showSizeChanger: false,
        }}
        scroll={{ y: 400, x: "max-content" }}
        size="small"
      />
    </Card>
  );
};

export default Inventory;
