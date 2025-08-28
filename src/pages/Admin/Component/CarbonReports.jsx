
import React, { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer
} from "recharts";
import { useGlobal } from "../../../Global";
import "../styles/CarbonReports.css";

const COLORS = ["#4caf50", "#ff9800", "#f44336", "#2196f3", "#9c27b0"];

const AdminCarbonReports = () => {
  const { orders, products } = useGlobal();
  const [filter, setFilter] = useState("This Month");

  // 🔹 Aggregate monthly emissions & saved CO₂
  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      emissions: 0,
      saved: 0,
    }));

    orders.forEach(order => {
      const date = new Date(order.date);
      const m = date.getMonth();
      const footprint = order.product?.carbonFootprint || 0;
      const qty = order.quantity || 1;

      months[m].emissions += footprint * qty;

      // Example: pretend eco-products save 20% footprint
      if (order.product?.ecoFriendly) {
        months[m].saved += footprint * qty * 0.2;
      }
    });

    return months;
  }, [orders]);

  // 🔹 Category-wise emissions
  const categoryData = useMemo(() => {
    const categoryTotals = {};
    orders.forEach(order => {
      const cat = order.category || "Others";
      const footprint = order.product?.carbonFootprint || 0;
      const qty = order.quantity || 1;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + footprint * qty;
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // 🔹 Seller emissions (eco-friendliness = lower footprint)
  const sellerData = useMemo(() => {
    const sellerTotals = {};
    orders.forEach(order => {
      const seller = order.seller || "Unknown";
      const footprint = order.product?.carbonFootprint || 0;
      const qty = order.quantity || 1;
      sellerTotals[seller] = (sellerTotals[seller] || 0) + footprint * qty;
    });

    return Object.entries(sellerTotals).map(([seller, footprint]) => ({ seller, footprint }));
  }, [orders]);

  // 🔹 Quick Stats
  const totalEmissions = categoryData.reduce((sum, c) => sum + c.value, 0);
  const topCategory = categoryData.reduce((a, b) => (a.value > b.value ? a : b), { name: "N/A", value: 0 });
  const bestSeller = sellerData.reduce((a, b) => (a.footprint < b.footprint ? a : b), { seller: "N/A", footprint: Infinity });

  return (
    <div className="carbon-reports-container">
      <h2>🌍 Carbon Analytics & Reports</h2>

      {/* Filters */}
      <div className="reports-filters">
        <label>Filter by:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>This Month</option>
          <option>Last 3 Months</option>
          <option>Custom Range</option>
        </select>
        <button className="export-btn">📄 Export PDF</button>
        <button className="export-btn">📊 Export Excel</button>
      </div>

      {/* Quick Stats */}
      <div className="reports-stats">
        <div className="stat-card">
          <h3>Total Emissions</h3>
          <p>{(totalEmissions / 1000).toFixed(2)} Tons</p>
        </div>
        <div className="stat-card">
          <h3>Top Category</h3>
          <p>{topCategory.name}</p>
        </div>
        <div className="stat-card">
          <h3>Most Eco-Friendly Seller</h3>
          <p>{bestSeller.seller} 🌱</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Line Chart */}
        <div className="chart-card">
          <h3>Monthly Carbon Footprint Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="emissions" stroke="#f44336" />
              <Line type="monotone" dataKey="saved" stroke="#4caf50" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <h3>Category-wise Emissions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="chart-card">
          <h3>Top Eco-Friendly Sellers</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sellerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="seller" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="footprint" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminCarbonReports;
