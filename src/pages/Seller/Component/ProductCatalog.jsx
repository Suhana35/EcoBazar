import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiUpload, FiSearch, FiEdit2, FiTrash2, FiStar } from "react-icons/fi";
import { useGlobal } from "../../../Global";
import "../styles/ProductCatalog.css";

const ProductCatalog = () => {
  const navigate = useNavigate();
  const { products, removeProduct } = useGlobal();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState([]);

  // Stock status helper
  const getStockStatus = (inventory) => {
    if (inventory > 10) return { text: "In Stock", className: "in-stock" };
    if (inventory > 0) return { text: "Low Stock", className: "low-stock" };
    return { text: "Out of Stock", className: "out-of-stock" };
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? p.type === categoryFilter : true;
    const stockStatus = getStockStatus(p.inventory).text;
    const matchesStatus = statusFilter ? stockStatus === statusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Select / Deselect
  const toggleSelect = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelected(filteredProducts.map((p) => p.id));
    else setSelected([]);
  };

  // Delete actions
  const deleteSelected = () => {
    if (selected.length === 0) return;
    if (window.confirm(`Delete ${selected.length} product(s)?`)) {
      selected.forEach((id) => removeProduct(id));
      setSelected([]);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      removeProduct(id);
      setSelected(selected.filter((sid) => sid !== id));
    }
  };

  const handleEdit = (id) => alert('Edited ');

  return (
    <div className="catalog-container">
      {/* Header */}
      <div className="catalog-header">
        <h2>Products</h2>
        <div className="header-actions">
          <button className="export-btn">
            <FiUpload /> Export
          </button>
          <button className="add-btn" onClick={() => navigate("/selAddProduct")}>
            <FiPlus /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar card">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-options">
          <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
            <option value="">Category: All</option>
            <option value="Hoodie">Hoodie</option>
            <option value="T-Shirt">T-Shirt</option>
            <option value="Jacket">Jacket</option>
            <option value="Jeans">Jeans</option>
          </select>
          <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
            <option value="">Status: All</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
        <button
          className="reset-btn"
          onClick={() => {
            setSearchTerm("");
            setCategoryFilter("");
            setStatusFilter("");
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="bulk-actions active">
          <button className="bulk-delete-btn" onClick={deleteSelected}>
            Delete {selected.length} Selected
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="table-container card">
        <table className="catalog-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={
                    filteredProducts.length > 0 &&
                    selected.filter((id) => filteredProducts.map((p) => p.id).includes(id)).length ===
                    filteredProducts.length
                  }
                />
              </th>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Carbon Footprint (kg CO₂ eq.)</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                  />
                </td>
                <td className="product-info">
                  <img src={p.image} alt={p.name} className="product-img" />
                  <div>
                    <div className="product-name">{p.name}</div>
                    <div className="product-type">{p.type}</div>
                    <div className={getStockStatus(p.inventory).className}>
                      {getStockStatus(p.inventory).text}
                    </div>
                  </div>
                </td>
                <td>$ {p.price.toFixed(2)}</td>
                <td>{p.inventory}</td>
                <td>{p.carbonFootprint}</td>
                <td>
                  {[...Array(Math.round(p.rating || 0))].map((_, i) => (
                    <FiStar key={i} color="#f5c518" />
                  ))} ({p.votes || 0})

                </td>
                <td className="product-actions">
                  <button className="action-btn edit" onClick={() => handleEdit(p.id)}>
                    <FiEdit2 />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(p.id)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductCatalog;
