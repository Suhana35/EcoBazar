import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiUpload, FiSearch, FiEdit2, FiTrash2, FiStar } from "react-icons/fi";
import "../styles/ProductCatalog.css";

const defaultProducts = [
  { id: 1, name: "Men Grey Hoodie", type: "Hoodie", inventory: 96, price: 49.9, carbonFootprint: 5.2, rating: 5.0, votes: 32, image: "https://i.imgur.com/kYCMkX4.png" },
  { id: 2, name: "Women Striped T-Shirt", type: "T-Shirt", inventory: 56, price: 34.9, carbonFootprint: 3.1, rating: 4.8, votes: 24, image: "https://i.imgur.com/G5g2rG2.png" },
  { id: 3, name: "Classic Leather Jacket", type: "Jacket", inventory: 8, price: 149.9, carbonFootprint: 12.5, rating: 4.9, votes: 58, image: "https://i.imgur.com/s1m0c2f.png" },
  { id: 4, name: "Denim Blue Jeans", type: "Jeans", inventory: 0, price: 79.9, carbonFootprint: 6.3, rating: 4.7, votes: 41, image: "https://i.imgur.com/T0aWJ3W.png" },
];

const ProductCatalog = ({ products: productsProp = [] }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([...defaultProducts]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState([]);

  // Sync products when prop changes
  // const [products, setProducts] = useState([...defaultProducts]);

useEffect(() => {
  const merged = [...defaultProducts];
  // find the max ID in current products
  let nextId = Math.max(...merged.map(p => p.id)) + 1;

  productsProp.forEach((p) => {
    merged.push({ ...p, id: nextId });
    nextId++;
  });

  setProducts(merged);
}, [productsProp]);

//   useEffect(() => {
//   const merged = [...defaultProducts];
//   // find the max ID in defaultProducts
//   console.log(merged);
//   let nextId = Math.max(...defaultProducts.map(p => p.id)) + 1;
//     console.log(nextId)
//   productsProp.forEach((p) => {
//     console.log(nextId);
//     merged.push({ ...p, id: nextId });
//     nextId++;
//   });
// console.log(merged);
//   setProducts(merged);
// }, [productsProp]);

// useEffect(() => {
//   const merged = [...defaultProducts];
//   productsProp.forEach((p) => {
//     if (!merged.some((dp) => dp.id === p.id)) merged.push(p);
//   });
//   setProducts(merged);
// }, [productsProp]);

  // useEffect(() => {
  //   setProducts([...defaultProducts, ...productsProp]);
  // }, [productsProp]);

  const getStockStatus = (inventory) => {
    if (inventory > 10) return { text: "In Stock", className: "in-stock" };
    if (inventory > 0) return { text: "Low Stock", className: "low-stock" };
    return { text: "Out of Stock", className: "out-of-stock" };
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? p.type === categoryFilter : true;
    const stockStatus = getStockStatus(p.inventory).text;
    const matchesStatus = statusFilter ? stockStatus === statusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleSelect = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected([...new Set([...selected, ...filteredProducts.map((p) => p.id)])]);
    } else {
      setSelected(selected.filter((id) => !filteredProducts.map((p) => p.id).includes(id)));
    }
  };

  const deleteSelected = () => {
    if (window.confirm(`Delete ${selected.length} product(s)?`)) {
      setProducts(products.filter((p) => !selected.includes(p.id)));
      setSelected([]);
    }
  };

  const handleEdit = (id) => alert(`Edit product ID: ${id}`);
  const handleDelete = (id) => {
    if (window.confirm("Delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
      setSelected(selected.filter((sid) => sid !== id));
    }
  };

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h2>Products</h2>
        <div className="header-actions">
          <button className="export-btn"><FiUpload /> Export</button>
          <button className="add-btn" onClick={() => navigate("/selAddProduct")}><FiPlus /> Add Product</button>
        </div>
      </div>

      <div className="filters-bar card">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search for products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-options">
          <select onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">Category: All</option>
            <option value="Hoodie">Hoodie</option>
            <option value="T-Shirt">T-Shirt</option>
            <option value="Jacket">Jacket</option>
            <option value="Jeans">Jeans</option>
          </select>
          <select onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Status: All</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
        <button className="reset-btn" onClick={() => { setSearchTerm(""); setCategoryFilter(""); setStatusFilter(""); }}>Reset Filters</button>
      </div>

      {selected.length > 0 && (
        <div className="bulk-actions active">
          <button className="bulk-delete-btn" onClick={deleteSelected}>Delete {selected.length} Selected</button>
        </div>
      )}

      <div className="table-container card">
        <table className="catalog-table">
          <thead>
            <tr>
              <th><input type="checkbox" onChange={toggleSelectAll} checked={filteredProducts.length > 0 && selected.filter((id) => filteredProducts.map((p) => p.id).includes(id)).length === filteredProducts.length} /></th>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Carbon Footprint (kg CO₂ eq.)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                <td className="product-info"><img src={p.image} alt={p.name} className="product-img" /><div><div className="product-name">{p.name}</div><div className="product-type">{p.type}</div></div></td>
                <td>$ {typeof p.price === "number" ? p.price.toFixed(2) : p.price}</td>
                <td>{p.inventory}</td>
                <td>{p.carbonFootprint}</td>
                <td className="product-actions">
                  <button className="action-btn edit" onClick={() => handleEdit(p.id)}><FiEdit2 /></button>
                  <button className="action-btn delete" onClick={() => handleDelete(p.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductCatalog;
