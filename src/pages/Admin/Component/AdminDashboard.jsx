
import React from "react";
import { Link } from "react-router-dom"; 
import { useGlobal } from "../../../Global";
import "../styles/AdminDashboard.css";


function formatNumber(n) {
  return n.toLocaleString();
}

function formatKg(n) {
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg CO₂e`;
}

// -- Simple LineChart (SVG) --
function LineChart({ data, height = 120, padding = 20 }) {
  if (!data.length) return null;
  const values = data.map((d) => d.value);
  const max = Math.max(...values) * 1.05;
  const stepX = (100 - padding * 2) / (data.length - 1);

  const points = data
    .map((d, i) => {
      const x = padding + i * stepX;
      const y = padding + ((max - d.value) / max) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="line-chart-svg">
      <polyline points={points} className="chart-line" fill="none" strokeWidth={0.8} />
      {data.map((d, i) => {
        const x = padding + i * stepX;
        const y = padding + ((max - d.value) / max) * (height - padding * 2);
        return <circle key={i} cx={x} cy={y} r={0.9} className="chart-point" />;
      })}
    </svg>
  );
}


function BarChart({ items, labelKey = "name", valueKey = "footprint", maxWidth = 100 }) {
  if (!items.length) return <p>No data</p>;
  const values = items.map((i) => i[valueKey]);
  const max = Math.max(...values);

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

export default function AdminDashboard() {
  const { users, products, orders } = useGlobal();

  const stats = {
    totalUsers: users.length,
    totalProducts: products.length,
    overallCarbon: orders.reduce(
      (sum, o) => sum + (o.product?.carbonFootprint || 0) * (o.quantity || 1),
      0
    ),
    totalSaved: products.reduce((sum, p) => sum + (p.savedCarbon || 0), 0),
  };


  const monthlyMap = {};
  orders.forEach((o) => {
    const month = new Date(o.date).toLocaleString("default", { month: "short" });
    const value = (o.product?.carbonFootprint || 0) * (o.quantity || 1);
    monthlyMap[month] = (monthlyMap[month] || 0) + value;
  });
  const monthlyFootprint = Object.entries(monthlyMap).map(([month, value]) => ({ month, value }));

 
  const sellerMap = {};
  orders.forEach((o) => {
    const seller = o.seller || "Unknown";
    const footprint = (o.product?.carbonFootprint || 0) * (o.quantity || 1);
    sellerMap[seller] = (sellerMap[seller] || 0) + footprint;
  });
  const topSellers = Object.entries(sellerMap)
    .map(([name, footprint]) => ({ name, footprint }))
    .sort((a, b) => a.footprint - b.footprint)
    .slice(0, 5);


  const productMap = {};
  orders.forEach((o) => {
    const pname = o.product?.name || "Unknown";
    const footprint = (o.product?.carbonFootprint || 0) * (o.quantity || 1);
    productMap[pname] = (productMap[pname] || 0) + footprint;
  });
  const highFootprintProducts = Object.entries(productMap)
    .map(([name, footprint]) => ({ name, footprint }))
    .sort((a, b) => b.footprint - a.footprint)
    .slice(0, 5);

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <Link to="/userManagement" className="nav-link">User Management</Link>
        <Link to="/productApproval" className="nav-link">Product Approval</Link>
        <Link to="/adminReports" className="nav-link">Carbon Reports</Link>
      </nav>

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
          </div>
          <div className="chart-content">
            <LineChart data={monthlyFootprint} height={160} />
            <div className="x-labels">
              {monthlyFootprint.map((m) => (
                <div key={m.month} className="x-label">{m.month}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card chart-side">
          <div className="chart-header">
            <h3>Top 5 Eco-friendly Sellers</h3>
          </div>
          <div className="chart-content">
            <BarChart items={topSellers} />
          </div>
        </div>

        <div className="chart-card chart-side">
          <div className="chart-header">
            <h3>Top 5 High-footprint Products</h3>
          </div>
          <div className="chart-content">
            <BarChart items={highFootprintProducts} />
          </div>
        </div>
      </section>
    </div>
  );
}
