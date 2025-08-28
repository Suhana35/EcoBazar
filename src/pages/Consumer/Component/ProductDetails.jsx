import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import "../styles/ProductDetails.css";
import defaultProducts from "../uitils/dummy";
import CheckOut from "./CheckOut";
import { useGlobal } from "../../../Global";

const ProductDetails = ({ products = [] }) => {
   const { addOrder } = useGlobal();
  const { productId } = useParams();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const allProducts = [...defaultProducts, ...products];
  const product = allProducts.find((p) => p.id === parseInt(productId));

  if (!product) return <p>Product not found!</p>;

  const handleCheckout = () => {
    const orderWithDate = { ...product, date: new Date().toISOString(), quantity };
    addOrder(orderWithDate);
    setShowPopup(true);
  };

  // Related Products (same type)
  const relatedProducts = allProducts.filter(p => p.type === product.type && p.id !== product.id).slice(0, 4);

  return (
    <div className="product-details-container card">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="product-details">
        {/* Product Image */}
        <div className="product-image-wrapper">
          <img src={product.image} alt={product.name} className="product-details-img" />
        </div>

        <div className="product-details-info">
          {/* Name & Tags */}
          <h2>{product.name}</h2>
          <div className="product-tags">
            <span>Eco-Friendly</span>
            <span>{product.type}</span>
          </div>

          {/* Ratings */}
          <p className="ratings">
            <strong>Rating:</strong>{" "}
            {Array.from({ length: 5 }, (_, i) => (
              <FiStar key={i} color={i < Math.round(product.ecoScore) ? "#FFD700" : "#ccc"} />
            ))}{" "}
            ({product.ecoScore} / 5)
          </p>

          {/* Price */}
          <p>Price: ₹{product.price.toFixed(2)}</p>

          {/* Quantity Selector */}

          <p><strong>Total:</strong> ₹{(product.price * quantity).toFixed(2)}</p>

          {/* Eco Score Visualization */}
          <p><strong>Eco Score Bar: </strong></p>
          <div className="eco-score-bar">

            <div className="eco-fill" style={{ width: `${(product.ecoScore / 5) * 100}%` }}></div>
          </div>

          {/* Carbon Footprint Pie Chart */}
          <div className="carbon-chart">
            <p><strong>Carbon Footprint:</strong></p>
            <div className="chart-bar">
              <div className="material" style={{ width: `${(product.materialCO2 / (product.materialCO2 + product.shippingCO2)) * 100}%` }}>
                Material {product.materialCO2} kg
              </div>
              <div className="shipping" style={{ width: `${(product.shippingCO2 / (product.materialCO2 + product.shippingCO2)) * 100}%` }}>
                Shipping {product.shippingCO2} kg
              </div>
            </div>
            <p><strong>Total:</strong> {product.materialCO2 + product.shippingCO2} kg CO₂</p>
          </div>

          {/* Checkout Button */}
          <button className="checkout-btn" onClick={handleCheckout}>
            <FiShoppingCart /> Checkout
          </button>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h3>Related Products</h3>
          <div className="related-list">
            {relatedProducts.map(p => (
              <div key={p.id} className="related-card" onClick={() => navigate(`/productInfo/${p.id}`)}>
                <img src={p.image} alt={p.name} />
                <p>{p.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <CheckOut show={showPopup}
        product={product}
        quantity={quantity}
        onClose={() => setShowPopup(false)} />
    </div>
  );
};

export default ProductDetails;
