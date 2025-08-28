import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { FiDownload } from "react-icons/fi";
import "../styles/CarbonReports.css";
import { useGlobal } from "../../../Global";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFE", "#FF6B6B"];

const CarbonReports = () => {

  // Convert date string to month (0-11)
  const getMonth = (dateStr) => new Date(dateStr).getMonth();
  const { orders } = useGlobal();
  
  // Filter orders for current month and last month
  const currentMonth = new Date().getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  const currentMonthOrders = useMemo(
    () => orders.filter((o) => getMonth(o.date) === currentMonth),
    [orders, currentMonth]
  );
  const lastMonthOrders = useMemo(
    () => orders.filter((o) => getMonth(o.date) === lastMonth),
    [orders, lastMonth]
  );

  // Total carbon emissions
  const totalCarbon = useMemo(
    () =>
      currentMonthOrders.reduce(
        (acc, o) => acc + (o.footprint || 0) * (o.quantity || 1),
        0
      ),
    [currentMonthOrders]
  );

  const lastMonthCarbon = useMemo(
    () =>
      lastMonthOrders.reduce(
        (acc, o) => acc + (o.footprint || 0) * (o.quantity || 1),
        0
      ),
    [lastMonthOrders]
  );

  const savedCO2 = lastMonthCarbon - totalCarbon;

  // Category-wise emissions
const categoryData = useMemo(() => {
  const map = {};
  currentMonthOrders.forEach(o => {
    const cat = o.category || o.product?.category || "Other";
    const footprint = o.product?.carbonFootprint || o.carbonFootprint || 0;
    map[cat] = (map[cat] || 0) + footprint * (o.quantity || 1);
  });
  return Object.entries(map).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2))
  }));
}, [currentMonthOrders]);

  // Seller eco ranking
  const sellerData = useMemo(() => {
  const map = {};
  currentMonthOrders.forEach(o => {
    const seller = o.seller || "Unknown";
    const footprint = o.product?.carbonFootprint || o.carbonFootprint || 0;
    map[seller] = (map[seller] || 0) + footprint * (o.quantity || 1);
  });
  return Object.entries(map)
    .map(([name, totalCarbon]) => ({ name, totalCarbon: Number(totalCarbon.toFixed(2)) }))
    .sort((a, b) => a.totalCarbon - b.totalCarbon);
}, [currentMonthOrders]);

  // Export CSV
  const downloadCSV = () => {
    const headers = "OrderID,Product,Seller,Category,Quantity,Footprint,Date\n";
    const rows = orders
      .map(
        (o) =>
          `${o.id},${o.name || o.product?.name},${o.seller || "Unknown"},${o.type || o.product?.category},${
            o.quantity || 1
          },${o.product?.carbonFootprint || o.carbonFootprint || 0},${o.date}`
      )
      .join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "carbon_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="carbon-reports-container">
      <h2>Carbon Analytics & Reports</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Carbon Emissions (This Month)</h3>
          <p>{totalCarbon.toFixed(2)} kg CO₂</p>
        </div>
        <div className="stat-card">
          <h3>CO₂ Saved Compared to Last Month</h3>
          <p>{savedCO2.toFixed(2)} kg CO₂</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Category-wise Emissions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={100} label>
                {categoryData.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Sellers Ranked by Eco-Friendliness</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sellerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalCarbon" name="Total CO₂ Emissions" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button className="export-btn" onClick={downloadCSV}>
        <FiDownload /> Export CSV
      </button>
    </div>
  );
};

export default CarbonReports;
