import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OrderHistory.css";
import { useGlobal } from "../../../Global";

const OrderHistory = () => {
  const { orders } = useGlobal();
  const navigate = useNavigate();

  const goToDetails = (id) => {
    navigate(`/productInfo/${id}`);
  };

  return (
    <div className="order-history-container">
        <button
        className="back-btn"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "15px" }}
      >
        ← Back
      </button>
      <h2 className="order-history-title">📦 Your Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders yet. Start shopping now! 🛒</p>
      ) : (
        <div className="order-list">
          {orders.map((order, index) => (
            <div
              key={index}
              className="order-card"
              onClick={() => goToDetails(order.id)}
            >
              <img src={order.image} alt={order.name} className="order-img" />
              <div className="order-info">
                <h3>{order.name}</h3>
                <p><strong>Price:</strong> ₹{order.price.toFixed(2)}</p>
                <p><strong>Eco Score:</strong> {order.ecoScore} / 5</p>
                <p>
                  <strong>Carbon Footprint:</strong>{" "}
                  {order.materialCO2 + order.shippingCO2} kg CO₂
                </p>
                <p>
                  <strong>Ordered On:</strong>{" "}
                  {order.date
                    ? new Date(order.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Date not available"}
                </p>
                <button
                  className="details-btn"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    goToDetails(order.id);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
