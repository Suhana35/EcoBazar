import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import "../styles/ProductCart.css";
import { useGlobal } from "../../../Global";
import CheckOut from "./CheckOut";

const ProductCart = ({ cartItems = [], setCartItems,addOrder, products = [] }) => {
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutQty, setCheckoutQty] = useState(1);

  // Adjust quantity
  const updateQuantity = (id, qty) => {
    setCartItems(prev =>
      prev.map(p => (p.id === id ? { ...p, quantity: Math.max(1, qty) } : p))
    );
  };

  // Remove product
  const removeProduct = id => {
    setCartItems(prev => prev.filter(p => p.id !== id));
  };

  // Calculate totals
  const totalCost = cartItems.reduce(
    (sum, p) => sum + p.price * (p.quantity || 1),
    0
  );
  const totalCO2 = cartItems.reduce(
    (sum, p) => sum + (p.materialCO2 + p.shippingCO2) * (p.quantity || 1),
    0
  );
  const ecoPoints = Math.round(totalCO2 * 0.1); // 10% of total carbon footprint as points

  // Handle checkout popup
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

  // Add each cart item to orders
  cartItems.forEach(item => {
    const orderWithDate = { ...item, date: new Date().toISOString() };
    addOrder(orderWithDate); // add to global orders
  });
    if (cartItems.length === 1) {
      // Single product checkout
      setCheckoutProduct(cartItems[0]);
      setCheckoutQty(cartItems[0].quantity || 1);
    } else {
      // Multiple product summary
      const multiProduct = {
        name: "Multiple Items",
        price: totalCost,
        ecoScore: "-",
        materialCO2: cartItems.reduce(
          (sum, p) => sum + p.materialCO2 * (p.quantity || 1),
          0
        ),
        shippingCO2: cartItems.reduce(
          (sum, p) => sum + p.shippingCO2 * (p.quantity || 1),
          0
        ),
      };
      setCheckoutProduct(multiProduct);

      setCheckoutQty(1);
    }
    setShowCheckout(true);
  };

  return (
    <div className="cart-page-container">
      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty! 🛒</p>
      ) : (
        <div className="cart-items">
          {cartItems.map(p => (
            <div key={p.id} className="cart-item-card">
              <img src={p.image} alt={p.name} className="cart-item-img" />
              <div className="cart-item-info">
                <h3>{p.name}</h3>
                <p>Price: ₹{p.price.toFixed(2)}</p>
                <p>Carbon Footprint: {p.materialCO2 + p.shippingCO2} kg CO₂</p>
                <div className="quantity-selector">
                  <button onClick={() => updateQuantity(p.id, (p.quantity || 1) - 1)}>
                    -
                  </button>
                  <span>{p.quantity || 1}</span>
                  <button onClick={() => updateQuantity(p.id, (p.quantity || 1) + 1)}>
                    +
                  </button>
                </div>
              </div>
              <button className="remove-btn" onClick={() => removeProduct(p.id)}>
                <FiTrash2 />
              </button>
            </div>
          ))}

          {/* Order Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p><strong>Total Cost:</strong> ₹{totalCost.toFixed(2)}</p>
            <p><strong>Total Carbon Footprint:</strong> {totalCO2.toFixed(2)} kg CO₂</p>
            <p><strong>Eco Points Earned:</strong> {ecoPoints} 🌱</p>
            <button className="checkout-btn" onClick={handleCheckout}>
              <FiShoppingCart /> Checkout
            </button>
          </div>
        </div>
      )}

      <button onClick={() => navigate("/home")} className="continue-btn">
        Continue Shopping
      </button>

      {/* Checkout Popup */}
      <CheckOut
        show={showCheckout}
        product={checkoutProduct}
        quantity={checkoutQty}
        onClose={() => setShowCheckout(false)}
      />
    </div>
  );
};

export default ProductCart;
