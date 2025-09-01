// File: AdminDashboard.jsx
// Description: React admin dashboard component (default export) + plain CSS below.
// Usage: place AdminDashboard.jsx in your React project (e.g. src/components/) and copy the CSS into AdminDashboard.css

import React from "react";
import { Link } from "react-router-dom"; 
import "../styles/AdminDashboard.css";

// -- Sample data (replace with props / API data) --
const sampleStats = {
  totalUsers: 12458,
  totalProducts: 3891,
  overallCarbon: 152345.7, // kg CO2e
  totalSaved: 8423.3, // kg CO2e
};

const monthlyFootprint = [
  { month: "Jan", value: 14500 },
  { month: "Feb", value: 13800 },
  { month: "Mar", value: 15500 },
  { month: "Apr", value: 14800 },
  { month: "May", value: 15200 },
  { month: "Jun", value: 16000 },
  { month: "Jul", value: 15600 },
  { month: "Aug", value: 15000 },
  { month: "Sep", value: 14900 },
  { month: "Oct", value: 15800 },
  { month: "Nov", value: 16100 },
  { month: "Dec", value: 16700 },
];

const topSellers = [
  { name: "GreenThreads", footprint: 4200 },
  { name: "EcoHome", footprint: 3900 },
  { name: "SolarGadgets", footprint: 3550 },
  { name: "ReUseMart", footprint: 3200 },
  { name: "BioPackaging", footprint: 2950 },
];

const highFootprintProducts = [
  { name: "FastFashion Tee", footprint: 650 },
  { name: "Imported Gadget", footprint: 590 },
  { name: "Non-recyclable Bottle", footprint: 540 },
  { name: "Large LED TV", footprint: 510 },
  { name: "Gas Heater", footprint: 480 },
];

// -- Small utilities for charts --
function getMax(arr) {
  return Math.max(...arr);
}

function formatNumber(n) {
  return n.toLocaleString();
}

function formatKg(n) {
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg CO₂e`;
}

// -- Simple LineChart (SVG) --
function LineChart({ data, height = 120, padding = 20 }) {
  const values = data.map((d) => d.value);
  const max = getMax(values) * 1.05;
  const stepX = (100 - padding * 2) / (data.length - 1);

  const points = data
    .map((d, i) => {
      const x = padding + i * stepX;
      const y = padding + ((max - d.value) / max) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  // grid lines (4 horizontal)
  const grid = [0, 0.33, 0.66, 1].map((t, i) => {
    const y = padding + t * (height - padding * 2);
    return <line key={i} x1={padding} x2={100 - padding} y1={y} y2={y} className="chart-grid-line" />;
  });

  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="line-chart-svg">
      {grid}
      <polyline points={points} className="chart-line" fill="none" strokeWidth={0.8} />
      {data.map((d, i) => {
        const x = padding + i * stepX;
        const y = padding + ((max - d.value) / max) * (height - padding * 2);
        return <circle key={i} cx={x} cy={y} r={0.9} className="chart-point" />;
      })}
    </svg>
  );
}

// -- Simple Vertical Bar Chart for rankings --
function BarChart({ items, labelKey = "name", valueKey = "footprint", maxWidth = 100 }) {
  const values = items.map((i) => i[valueKey]);
  const max = getMax(values);

  return (
    <div className="bar-chart">
      {items.map((it, idx) => {
        const w = (it[valueKey] / max) * maxWidth;
        return (
          <div className="bar-row" key={idx}>
            <div className="bar-label">{it[labelKey]}</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${w}%` }} />
            </div>
            <div className="bar-value">{formatKg(it[valueKey])}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboard({ stats = sampleStats }) {
  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p className="sub">Overview of platform carbon stats and listings</p>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">{formatNumber(stats.totalUsers)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Total Products</div>
          <div className="stat-value">{formatNumber(stats.totalProducts)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Overall Carbon Footprint</div>
          <div className="stat-value">{formatKg(stats.overallCarbon)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Total CO₂ Saved</div>
          <div className="stat-value">{formatKg(stats.totalSaved)}</div>
        </div>
      </section>

      <section className="charts-section">
        <div className="chart-card chart-large">
          <div className="chart-header">
            <h3>Monthly Carbon Footprint Trend</h3>
            <small>Last 12 months</small>
          </div>
          <div className="chart-content">
            <LineChart data={monthlyFootprint} height={160} />
            <div className="x-labels">
              {monthlyFootprint.map((m) => (
                <div key={m.month} className="x-label">
                  {m.month}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card chart-side">
          <div className="chart-header">
            <h3>Top 5 Eco-friendly Sellers</h3>
            <small>Lower footprint = better</small>
          </div>
          <div className="chart-content">
            <BarChart items={topSellers} />
          </div>
        </div>

        <div className="chart-card chart-side">
          <div className="chart-header">
            <h3>Top 5 High-footprint Products</h3>
            <small>Highest product footprints</small>
          </div>
          <div className="chart-content">
            <BarChart items={highFootprintProducts} />
          </div>
        </div>
      </section>

      {/* <footer className="dashboard-footer">
        <small>Data shown is sample data. Connect real API to replace sample arrays.</small>
      </footer> */}
    </div>
  );
}

