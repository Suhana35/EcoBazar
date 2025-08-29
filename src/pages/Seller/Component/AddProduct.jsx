import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud, FiX } from "react-icons/fi";
import "../styles/AddProduct.css";

const INITIAL_CATEGORIES = ["Clothing", "Electronics", "Food"];
const INITIAL_MATERIALS = ["Cotton", "Plastic", "Metal"];
const SHIPPING_MODES = ["Air", "Road", "Sea"];

// Simple emission factors for footprint calculation (example values)
const EMISSION_FACTORS = {
  Air: 0.5, // kg CO2 per kg product per 100 km
  Road: 0.2,
  Sea: 0.1,
};

const AddProduct = ({ setProducts }) => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    material: "",
    weight: "",
    shippingMode: "Air",
    carbonFootprint: "",
    image: null,
  });

  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // --- Handle form input changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Handle image upload ---
  const selectFiles = () => fileInputRef.current.click();
  const onFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImages([{ name: file.name, url: reader.result }]);
        setProductData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Calculate carbon footprint ---
  useEffect(() => {
    const weight = parseFloat(productData.weight) || 0;
    const modeFactor = EMISSION_FACTORS[productData.shippingMode] || 0;
    const footprint = (weight * modeFactor).toFixed(2);
    setProductData((prev) => ({
      ...prev,
      carbonFootprint: footprint ? `${footprint} kg CO₂` : "",
    }));
  }, [productData.weight, productData.shippingMode]);

  // --- Form submission ---
  const handleSave = () => {
    const finalProduct = {
      id: Date.now(),
      name: productData.name || "Untitled Product",
      price: parseFloat(productData.price) || 0,
      quantity: parseInt(productData.quantity) || 0,
      category: productData.category || "General",
      material: productData.material || "Unknown",
      weight: productData.weight || "0",
      shippingMode: productData.shippingMode,
      carbonFootprint: productData.carbonFootprint,
      image: productData.image || "https://via.placeholder.com/100",
    };
    setProducts((prev) => [...prev, finalProduct]);
    navigate("/selProducts");
  };

  return (
    <div className="add-product-container">
      <div className="header">
        <h2>Add New Product</h2>
        <div className="actions">
          <button className="btn cancel" onClick={() => navigate("/selProducts")}>Cancel</button>
          <button className="btn save" onClick={handleSave}>Save</button>
        </div>
      </div>

      <div className="content">
        <div className="left">
          <div className="card">
            <h3>Product Information</h3>
            <label>Product Name</label>
            <input name="name" type="text" value={productData.name} onChange={handleChange} placeholder="Enter product name" />

            <label>Price</label>
            <input name="price" type="number" value={productData.price} onChange={handleChange} placeholder="0.00" />

            <label>Quantity</label>
            <input name="quantity" type="number" value={productData.quantity} onChange={handleChange} placeholder="0" />

            <label>Category</label>
            <select name="category" value={productData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              {INITIAL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>

            <label>Material</label>
            <select name="material" value={productData.material} onChange={handleChange}>
              <option value="">Select Material</option>
              {INITIAL_MATERIALS.map((m) => <option key={m}>{m}</option>)}
            </select>

            <label>Weight (kg)</label>
            <input name="weight" type="number" value={productData.weight} onChange={handleChange} placeholder="0.0" />

            <label>Shipping Mode</label>
            <select name="shippingMode" value={productData.shippingMode} onChange={handleChange}>
              {SHIPPING_MODES.map((mode) => <option key={mode}>{mode}</option>)}
            </select>

            <label>Carbon Footprint</label>
            <input type="text" value={productData.carbonFootprint} readOnly />
            {productData.carbonFootprint && (
              <p>Approx. Equivalent: Driving {(parseFloat(productData.carbonFootprint) * 4).toFixed(1)} km 🚗</p>
            )}
          </div>

          <div className="card">
            <h3>Product Image</h3>
            <div className="upload-box" onClick={selectFiles}>
              <FiUploadCloud size={40} />
              <p>Click to upload an image</p>
              <input ref={fileInputRef} type="file" hidden onChange={onFileSelect} accept="image/*" />
            </div>
            {images.length > 0 && (
              <div className="image-preview-container">
                {images.map((img) => (
                  <div key={img.name} className="image-preview">
                    <img src={img.url} alt={img.name} />
                    <button className="remove-image-btn" onClick={() => setImages([])}><FiX /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
