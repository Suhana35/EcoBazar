import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer
} from "recharts";
import "../styles/CarbonReports.css";

const COLORS = ["#4caf50", "#ff9800", "#f44336", "#2196f3", "#9c27b0"];

const AdminCarbonReports = () => {
  // Dummy Data
  const monthlyData = [
    { month: "Jan", emissions: 40, saved: 10 },
    { month: "Feb", emissions: 35, saved: 15 },
    { month: "Mar", emissions: 50, saved: 20 },
    { month: "Apr", emissions: 45, saved: 18 },
    { month: "May", emissions: 38, saved: 22 },
  ];

  const categoryData = [
    { name: "Clothing", value: 30 },
    { name: "Electronics", value: 45 },
    { name: "Home", value: 25 },
    { name: "Beauty", value: 15 },
    { name: "Others", value: 10 },
  ];

  const sellerData = [
    { seller: "EcoStore", footprint: 5 },
    { seller: "GreenMart", footprint: 10 },
    { seller: "NatureWear", footprint: 7 },
    { seller: "FreshLiving", footprint: 12 },
    { seller: "EcoTrendz", footprint: 6 },
  ];

  const [filter, setFilter] = useState("This Month");

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
          <p>42.5 Tons</p>
        </div>
        <div className="stat-card">
          <h3>CO₂ Saved vs Last Month</h3>
          <p className="positive">+12%</p>
        </div>
        <div className="stat-card">
          <h3>Top Category</h3>
          <p>Electronics</p>
        </div>
        <div className="stat-card">
          <h3>Most Eco-Friendly Seller</h3>
          <p>EcoStore 🌱</p>
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
