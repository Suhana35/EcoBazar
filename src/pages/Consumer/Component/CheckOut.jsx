
import React from "react";
import { useNavigate } from "react-router-dom";

const CheckOut = ({ show, product, quantity, onClose }) => {
  const navigate = useNavigate();

  if (!show || !product) return null; // Don't render if not shown

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>✅ Order Successful!</h2>

        <hr />
        <p>Your product has been ordered successfully.</p>
        <hr />

        <h3>Order Details:</h3>
        <p><strong>Product:</strong> {product.name}</p>
        <p><strong>Price:</strong> ₹{(product.price * quantity).toFixed(2)}</p>
        <p><strong>Quantity:</strong> {quantity}</p>
        <p><strong>Eco Score:</strong> {product.ecoScore}</p>
        <p><strong>Carbon Footprint:</strong> {product.materialCO2 + product.shippingCO2} kg CO₂</p>

        <button className="close-btn" onClick={onClose}>Close</button>
        <button
          className="history-btn"
          onClick={() => navigate("/orders")}
        >
          View Order History
        </button>
      </div>
    </div>
  );
};

export default CheckOut;
