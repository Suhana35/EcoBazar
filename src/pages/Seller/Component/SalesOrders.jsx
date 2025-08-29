import React, { useState, useEffect } from "react";
import "../styles/SalesOrders.css";

// Sample data for orders
const defaultOrders = [
  {
    id: 1,
    product: { name: "Men Grey Hoodie", price: 49.9, carbonFootprint: 5.2 },
    buyer: { name: "John Doe", email: "john@example.com" },
    quantity: 2,
  },
  {
    id: 2,
    product: { name: "Women Striped T-Shirt", price: 34.9, carbonFootprint: 3.1 },
    buyer: { name: "Jane Smith", email: "jane@example.com" },
    quantity: 3,
  },
  {
    id: 3,
    product: { name: "Classic Leather Jacket", price: 149.9, carbonFootprint: 12.5 },
    buyer: { name: "Alex Johnson", email: "alex@example.com" },
    quantity: 1,
  },
];

const SalesOrders = ({ ordersProp = [] }) => {
    const orders = ordersProp;
//   const [orders, setOrders] = useState([...defaultOrders, ...ordersProp]);

  // Optionally calculate total revenue and carbon footprint per order
  const calculateRevenue = (order) => (order.product.price * order.quantity).toFixed(2);
  const calculateCarbon = (order) => (order.product.carbonFootprint * order.quantity).toFixed(2);

  return (
    <div className="sales-orders-container">
      <h2>Sales & Orders</h2>

      {orders.length === 0 ? (
        <p>No orders received yet.</p>
      ) : (
        <div className="table-container card">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Buyer</th>
                <th>Quantity Sold</th>
                <th>Revenue ($)</th>
                <th>Carbon Footprint (kg CO₂ eq.)</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <div className="product-info">
                      <div className="product-name">{order.product.name}</div>
                      <div className="product-price">$ {order.product.price.toFixed(2)}</div>
                    </div>
                  </td>
                  <td>
                    <div className="buyer-info">
                      <div className="buyer-name">{order.buyer.name}</div>
                      <div className="buyer-email">{order.buyer.email}</div>
                    </div>
                  </td>
                  <td>{order.quantity}</td>
                  <td>{calculateRevenue(order)}</td>
                  <td>{calculateCarbon(order)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesOrders;
