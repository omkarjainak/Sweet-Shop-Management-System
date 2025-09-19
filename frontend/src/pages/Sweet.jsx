import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Input, message, Card, Modal, Form, InputNumber, Select, Space } from "antd";
import { getToken, getUserRole } from "../utils/auth";

const { Option } = Select;

const Sweet = () => {
  const token = getToken();
  const role = getUserRole(); // user, admin, superadmin

  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "", minPrice: null, maxPrice: null });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);

  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [purchaseQty, setPurchaseQty] = useState(1);

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const blueButtonStyle = {
    backgroundColor: "#1890ff",
    borderColor: "#1890ff",
    color: "#fff",
  };

  // Fetch sweets with sorting
  const fetchSweets = useCallback(async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/sweets${query}`, {
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

  // Extract unique categories dynamically
  const categories = Array.from(new Set(sweets.map((s) => s.category))).filter(Boolean);

  // Handle search/filter
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    let query = "/search?";
    if (search) query += `name=${encodeURIComponent(search)}&`;
    if (newFilters.category) query += `category=${encodeURIComponent(newFilters.category)}&`;
    if (newFilters.minPrice != null) query += `minPrice=${newFilters.minPrice}&`;
    if (newFilters.maxPrice != null) query += `maxPrice=${newFilters.maxPrice}&`;
    if (query.endsWith("&")) query = query.slice(0, -1);
    if (query === "/search?") query = "";

    fetchSweets(query);
    setCurrentPage(1);
  };

  const handleSearch = () => handleFilterChange("search", search);

  const openPurchaseModal = (sweet) => {
    setSelectedSweet(sweet);
    setPurchaseQty(1);
    setPurchaseModalVisible(true);
  };

  const handlePurchase = async () => {
    if (!selectedSweet) return;
    try {
      const res = await fetch(`http://localhost:5000/api/sweets/${selectedSweet.id}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: purchaseQty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Purchase failed");
      message.success("Purchase successful!");
      setPurchaseModalVisible(false);
      fetchSweets();
    } catch (err) {
      message.error(err.message);
    }
  };

  const canAddEdit = role === "admin" || role === "superadmin";
  const canDeleteRestock = role === "admin" || role === "superadmin";

  const handleAddUpdateSweet = async (values) => {
    const url = editingSweet
      ? `http://localhost:5000/api/sweets/${editingSweet.id}`
      : "http://localhost:5000/api/sweets";
    const method = editingSweet ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Operation failed");
      message.success(editingSweet ? "Sweet updated!" : "Sweet added!");
      setModalVisible(false);
      setEditingSweet(null);
      fetchSweets();
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleDelete = async (sweetId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/sweets/${sweetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      message.success("Sweet deleted!");
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
      title: "Actions",
      key: "actions",
      width: 250,
      render: (_, record) => (
        <Space>
          {role === "user" && (
            <Button type="primary" style={blueButtonStyle} onClick={() => openPurchaseModal(record)}>
              Purchase
            </Button>
          )}
          {canAddEdit && (
            <Button style={blueButtonStyle} onClick={() => { setEditingSweet(record); setModalVisible(true); }}>
              Edit
            </Button>
          )}
          {canDeleteRestock && (
            <Button style={blueButtonStyle} onClick={() => handleDelete(record.id)}>
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card className="shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Sweets Management</h2>
        {canAddEdit && (
          <Button type="primary" style={blueButtonStyle} onClick={() => setModalVisible(true)}>
            Add Sweet
          </Button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex gap-2 mb-4">
        <Input placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select
          placeholder="Category"
          allowClear
          style={{ width: 150 }}
          value={filters.category || undefined}
          onChange={(value) => handleFilterChange("category", value)}
        >
          {categories.map((cat) => (
            <Option key={cat} value={cat}>{cat}</Option>
          ))}
        </Select>
        <InputNumber
          placeholder="Min Price"
          min={0}
          style={{ width: 100 }}
          value={filters.minPrice}
          onChange={(value) => handleFilterChange("minPrice", value)}
        />
        <InputNumber
          placeholder="Max Price"
          min={0}
          style={{ width: 100 }}
          value={filters.maxPrice}
          onChange={(value) => handleFilterChange("maxPrice", value)}
        />
        <Button type="primary" style={blueButtonStyle} onClick={handleSearch}>Search</Button>
        <Button style={blueButtonStyle} onClick={() => {
          setSearch("");
          setFilters({ category: "", minPrice: null, maxPrice: null });
          fetchSweets();
        }}>Reset</Button>
      </div>

      {/* Table */}
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

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        title={editingSweet ? "Edit Sweet" : "Add Sweet"}
        onCancel={() => { setModalVisible(false); setEditingSweet(null); }}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={editingSweet || { name: "", category: "", price: 0, quantity: 0 }}
          onFinish={handleAddUpdateSweet}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Input placeholder="Enter new or existing category" />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Quantity" name="quantity" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" style={blueButtonStyle} htmlType="submit" className="w-full">
              {editingSweet ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Purchase Modal */}
      <Modal
        visible={purchaseModalVisible}
        title={`Purchase Sweet: ${selectedSweet?.name}`}
        onCancel={() => setPurchaseModalVisible(false)}
        onOk={handlePurchase}
        okButtonProps={{ style: blueButtonStyle }}
      >
        <InputNumber
          min={1}
          max={selectedSweet?.quantity || 1}
          value={purchaseQty}
          onChange={(value) => setPurchaseQty(value)}
          style={{ width: "100%" }}
        />
      </Modal>
    </Card>
  );
};

export default Sweet;
