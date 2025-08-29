import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell,
} from "recharts";
import { FiTrendingUp, FiPackage, FiFeather, FiZap, FiFilter, FiSearch } from "react-icons/fi";

import "../styles/SellerDashboard.css";

// -----------------------------
// Mock Data
// -----------------------------
const salesFootprintMonthly = [
  { month: "Jan", sales: 120000, footprint: 420 },
  { month: "Feb", sales: 98000, footprint: 400 },
  { month: "Mar", sales: 143000, footprint: 460 },
  { month: "Apr", sales: 158000, footprint: 430 },
  { month: "May", sales: 172000, footprint: 410 },
  { month: "Jun", sales: 165000, footprint: 395 },
  { month: "Jul", sales: 180000, footprint: 385 },
  { month: "Aug", sales: 175000, footprint: 370 },
  { month: "Sep", sales: 168000, footprint: 360 },
  { month: "Oct", sales: 190000, footprint: 350 },
  { month: "Nov", sales: 210000, footprint: 345 },
  { month: "Dec", sales: 230000, footprint: 330 },
];

const productCatalog = [
  { id: 1, name: "Bamboo Toothbrush", category: "Personal Care", unitsSold: 820, revenue: 41000, ecoScore: 92, footprintPerUnit: 0.12 },
  { id: 2, name: "Recycled Paper Towels", category: "Home", unitsSold: 540, revenue: 27000, ecoScore: 85, footprintPerUnit: 0.18 },
  { id: 3, name: "Organic Cotton Tote", category: "Accessories", unitsSold: 1270, revenue: 63500, ecoScore: 88, footprintPerUnit: 0.09 },
  { id: 4, name: "Solar Garden Light", category: "Outdoor", unitsSold: 390, revenue: 58500, ecoScore: 80, footprintPerUnit: 0.25 },
  { id: 5, name: "Steel Water Bottle", category: "Kitchen", unitsSold: 1510, revenue: 120800, ecoScore: 78, footprintPerUnit: 0.14 },
  { id: 6, name: "Compostable Mailer", category: "Packaging", unitsSold: 2000, revenue: 60000, ecoScore: 95, footprintPerUnit: 0.05 },
];

// -----------------------------
// UI Components
// -----------------------------
function StatCard({ title, value, sub, icon: Icon }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="stat-card">
      <div className="stat-icon"><Icon className="icon" /></div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
    </motion.div>
  );
}

function Card({ title, action, children }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function EcoTip({ text }) {
  return (
    <li className="eco-tip">
      <FiZap className="eco-icon" />
      <span>{text}</span>
    </li>
  );
}

// -----------------------------
// Dashboard
// -----------------------------
export default function SellerDashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [onlyEco, setOnlyEco] = useState(true);
  const [range, setRange] = useState("YTD");

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    const list = productCatalog.filter((p) => {
      if (onlyEco && p.ecoScore < 80) return false;
      if (!query) return true;
      return (
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
    });
    return [...list].sort((a, b) => b.unitsSold - a.unitsSold);
  }, [onlyEco, query]);

  // Aggregated stats
  const totalRevenue = useMemo(() => productCatalog.reduce((acc, p) => acc + p.revenue, 0), []);
  const totalProducts = useMemo(() => productCatalog.length, []);
  const avgFootprint = useMemo(() => (productCatalog.reduce((acc, p) => acc + p.footprintPerUnit, 0) / productCatalog.length).toFixed(2), []);

  // Range data for charts
  const rangeData = useMemo(() => {
    if (range === "3M") return salesFootprintMonthly.slice(-3);
    if (range === "6M") return salesFootprintMonthly.slice(-6);
    return salesFootprintMonthly;
  }, [range]);

  // Eco suggestions
  const ecoSuggestions = [
    "Switch to recyclable packaging to cut ~10% footprint.",
    "Offer a discount for bottle refills to reduce single-use waste.",
    "Bundle shipments by region to lower transport emissions.",
    "Add lifecycle info on product pages to nudge greener choices.",
  ];

  // Pie chart data
  const footprintByCategory = useMemo(() => {
    const map = new Map();
    productCatalog.forEach((p) => {
      const current = map.get(p.category) || 0;
      map.set(p.category, current + p.footprintPerUnit * p.unitsSold);
    });
    return Array.from(map, ([name, value]) => ({ name, value: Number(value.toFixed(2)) }));
  }, []);

  return (
    <div className="dashboard">
      <div className="container">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Seller Dashboard</h1>
            <p className="dashboard-subtitle">Overview of sales, products, and sustainability metrics</p>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products or category" />
            </div>
            <button onClick={() => setOnlyEco((v) => !v)} className={`eco-toggle ${onlyEco ? "active" : ""}`}>
              <FiFilter /> {onlyEco ? "Eco only" : "All"}
            </button>
            <select value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="3M">Last 3M</option>
              <option value="6M">Last 6M</option>
              <option value="YTD">12M</option>
            </select>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stat-grid">
          <StatCard title="Total Sales Revenue" value={`₹${totalRevenue.toLocaleString()}`} sub="All products YTD" icon={FiTrendingUp} />
          <StatCard title="Total Products Listed" value={totalProducts} sub="Active listings" icon={FiPackage} />
          <StatCard title="Avg Footprint / Product" value={`${avgFootprint} kg CO₂e`} sub="Weighted per SKU" icon={FiFeather} />
          <StatCard title="Eco Suggestions" value={`${ecoSuggestions.length}`} sub="Actionable tips" icon={FiZap} />
        </div>

        {/* Charts */}
        <div className="grid-3">
          <Card title="Sales vs. Footprint Trend" action={<div className="small-note">Revenue (₹) & CO₂e (kg)</div>}>
            <div className="chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rangeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(v, n) => (n === "sales" ? `₹${v.toLocaleString()}` : `${v} kg`)} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="sales" name="Sales" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="footprint" name="Footprint" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Best-Selling Eco-Friendly Products" action={<span className="small-note">Top by units</span>}>
            <div className="chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredProducts.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="unitsSold" name="Units Sold" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Footprint Share by Category" action={<span className="small-note">Lower is better</span>}>
            <div className="chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie dataKey="value" nameKey="name" outerRadius={90} data={footprintByCategory} label>
                    {footprintByCategory.map((_, idx) => (<Cell key={`c-${idx}`} />))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Products + Tips */}
        <div className="grid-3">
          <Card title="Eco Suggestions">
            <ul className="eco-list">
              {ecoSuggestions.map((t, i) => (<EcoTip key={i} text={t} />))}
            </ul>
          </Card>

          <Card title="Product Leaderboard" action={<span className="small-note">Eco filter: {onlyEco ? "ON" : "OFF"}</span>}>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Units</th>
                    <th>Revenue</th>
                    <th>Eco Score</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>{p.unitsSold.toLocaleString()}</td>
                      <td>₹{p.revenue.toLocaleString()}</td>
                      <td>{p.ecoScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Quick Actions">
            <div className="quick-actions">
              <button onClick={() => navigate("/selAddProduct")}>Add Product</button>
              <button onClick={() => navigate("/selProducts")}>Product List</button>
              <button onClick={() => navigate("/salesOrders")}>Sales and Orders</button>
              <button onClick={() => navigate("/carbonReports")}>Carbon Reports</button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
