import React, { useEffect, useState, useCallback } from "react";
import { Input, Button, Table, message, InputNumber, Card, Select, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const Home = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [purchaseQty, setPurchaseQty] = useState({});
  const [filters, setFilters] = useState({ name: "", category: "", minPrice: null, maxPrice: null });
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const token = getToken();

  const pageSize = 10;

  // Fetch sweets with sorting by id ascending
  const fetchSweets = useCallback(async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/sweets${query}`);
      const data = await res.json();
      // Sort by id ascending
      setSweets(data.sort((a, b) => a.id - b.id));
    } catch {
      message.error("Failed to fetch sweets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    let query = "/search?";
    if (newFilters.name) query += `name=${encodeURIComponent(newFilters.name)}&`;
    if (newFilters.category) query += `category=${encodeURIComponent(newFilters.category)}&`;
    if (newFilters.minPrice != null) query += `minPrice=${newFilters.minPrice}&`;
    if (newFilters.maxPrice != null) query += `maxPrice=${newFilters.maxPrice}&`;
    if (query.endsWith("&")) query = query.slice(0, -1);
    if (query === "/search?") query = "";

    fetchSweets(query);
  };

  const handlePurchase = async (id) => {
    const quantity = purchaseQty[id] || 1;
    if (!token) return message.warning("Please login to purchase.");

    try {
      const res = await fetch(`http://localhost:5000/api/sweets/${id}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Purchase failed");
      message.success("Purchase successful!");
      setPurchaseQty((prev) => ({ ...prev, [id]: 1 }));
      fetchSweets();
    } catch (err) {
      message.error(err.message);
    }
  };

  const paginatedData = sweets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Sweet Shop
          <PlusOutlined style={{ fontSize: "1.5rem", color: "#1890ff" }} />
        </h1>
        {!token && (
          <Button
            type="primary"
            style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
            onClick={() => navigate("/login")}
          >
            Login / Signup
          </Button>
        )}
      </div>

      <div className="flex gap-4">
        {/* Filters fixed on left */}
        <Card
          title="Filters"
          className="shadow-sm"
          style={{
            width: 250,
            position: "sticky",
            top: 20,
            height: "calc(100vh - 100px)",
          }}
        >
          <div className="flex flex-col gap-4">
            <Input
              size="middle"
              placeholder="Name"
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
            />
            <Select
              size="middle"
              placeholder="Category"
              allowClear
              style={{ width: "100%" }}
              value={filters.category || undefined}
              onChange={(value) => handleFilterChange("category", value)}
            >
              <Option value="Chocolate">Chocolate</Option>
              <Option value="Candy">Candy</Option>
              <Option value="Confectionery">Confectionery</Option>
              <Option value="Baked Goods">Baked Goods</Option>
            </Select>
            <InputNumber
              size="middle"
              placeholder="Min Price"
              min={0}
              style={{ width: "100%" }}
              value={filters.minPrice}
              onChange={(value) => handleFilterChange("minPrice", value)}
            />
            <InputNumber
              size="middle"
              placeholder="Max Price"
              min={0}
              style={{ width: "100%" }}
              value={filters.maxPrice}
              onChange={(value) => handleFilterChange("maxPrice", value)}
            />
            <Button
              size="middle"
              type="default"
              onClick={() =>
                setFilters({ name: "", category: "", minPrice: null, maxPrice: null }) ||
                fetchSweets()
              }
            >
              Reset Filters
            </Button>
          </div>
        </Card>

        {/* Compact Table */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Table
            dataSource={paginatedData}
            loading={loading}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize,
              total: sweets.length,
              onChange: (page) => setCurrentPage(page),
              showSizeChanger: false,
            }}
            scroll={{ y: 400, x: "max-content" }}
            size="middle"
            columns={[
              { title: "ID", dataIndex: "id", key: "id", sorter: (a, b) => a.id - b.id },
              { title: "Name", dataIndex: "name", key: "name", fixed: "left" },
              { title: "Category", dataIndex: "category", key: "category" },
              { title: "Price", dataIndex: "price", key: "price" },
              { title: "Quantity", dataIndex: "quantity", key: "quantity" },
              {
                title: "Purchase",
                key: "purchase",
                fixed: "right",
                render: (_, record) => (
                  <Space>
                    <InputNumber
                      size="small"
                      min={1}
                      max={record.quantity}
                      value={purchaseQty[record.id] || 1}
                      onChange={(value) =>
                        setPurchaseQty((prev) => ({ ...prev, [record.id]: value }))
                      }
                    />
                    <Button
                      size="small"
                      type="primary"
                      disabled={record.quantity === 0}
                      onClick={() => handlePurchase(record.id)}
                      style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
                    >
                      Buy
                    </Button>
                  </Space>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
