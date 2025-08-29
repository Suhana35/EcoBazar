// File: ProductApproval.jsx
// Admin Product Approval page — upgraded with:
// - Product Details Modal / Preview (images, description, seller info)
// - Audit Trail / History (who approved/rejected and when)
// - Footprint Verification Assistance (auto-suggest based on category + weight)
// - Category & Status filters (Pending/Approved/Rejected + categories)
// - Activity Insights (cards above table)

import React, { useState, useMemo } from "react";
import "../styles/ProductApproval.css";

const ADMIN_NAME = "AdminUser";

const initialProducts = [
  {
    id: 1,
    name: "FastFashion Tee",
    seller: {
      name: "GreenThreads",
      rating: 4.2,
      joinDate: "2023-09-02",
      totalProducts: 34,
      email: "hello@greenthreads.example",
    },
    category: "Clothing",
    price: 14.99,
    weightKg: 0.25,
    footprint: 6.5, // kg CO2e
    status: "Pending",
    notes: "Imported cotton, short production cycle",
    description:
      "A soft tee made quickly to meet trend cycles. Single-use fashion grade cotton; consider sustainable alternatives.",
    images: [
      "https://via.placeholder.com/320x200?text=FastFashion+1",
      "https://via.placeholder.com/320x200?text=FastFashion+2",
    ],
    audit: [],
  },
  {
    id: 2,
    name: "Reusable Water Bottle",
    seller: {
      name: "EcoHome",
      rating: 4.9,
      joinDate: "2022-03-11",
      totalProducts: 68,
      email: "support@ecohome.example",
    },
    category: "Home",
    price: 24.5,
    weightKg: 0.4,
    footprint: 4.5,
    status: "Pending",
    notes: "Made with recycled steel",
    description:
      "Durable reusable bottle made from recycled steel. Low lifecycle footprint compared to single-use plastic bottles.",
    images: ["https://via.placeholder.com/320x200?text=Bottle"],
    audit: [],
  },
  {
    id: 3,
    name: "Imported Gadget",
    seller: {
      name: "SolarGadgets",
      rating: 4.4,
      joinDate: "2021-11-20",
      totalProducts: 12,
      email: "sales@solargadgets.example",
    },
    category: "Electronics",
    price: 229.0,
    weightKg: 2.1,
    footprint: 59.0,
    status: "Pending",
    notes: "Long-distance shipping included",
    description:
      "Electronic device assembled overseas. Shipping contributes significantly to footprint.",
    images: ["https://via.placeholder.com/320x200?text=Gadget"],
    audit: [],
  },
  {
    id: 4,
    name: "Biodegradable Wrap",
    seller: {
      name: "BioPackaging",
      rating: 4.6,
      joinDate: "2024-01-08",
      totalProducts: 9,
      email: "contact@biopack.example",
    },
    category: "Home",
    price: 4.99,
    weightKg: 0.05,
    footprint: 0.8,
    status: "Pending",
    notes: "Local production",
    description: "A kitchen wrap made from certified biodegradable materials.",
    images: ["https://via.placeholder.com/320x200?text=Wrap"],
    audit: [],
  },
];

// Simple heuristic to suggest footprint based on category and weight
function suggestFootprint(category, weightKg) {
  // base factors per kg by category (kg CO2e per kg)
  const factors = {
    Clothing: 25, // clothing tends to be high due to fibres & processing
    Electronics: 300,
    Home: 40,
    Other: 50,
  };
  const factor = factors[category] ?? factors.Other;
  // suggestion with a small multiplier and baseline
  const suggested = Math.max(0.1, (weightKg || 0.1) * factor * 0.1);
  // Round to 1 decimal
  return Math.round(suggested * 10) / 10;
}

export default function ProductApproval() {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [editing, setEditing] = useState(null); // for footprint verify
  const [viewing, setViewing] = useState(null); // product details modal
  const [page, setPage] = useState(1);
  const perPage = 6;
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("Pending");

  // derived lists
  const allCategories = useMemo(() => {
    const setCats = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(setCats)];
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => (filterStatus === "All" ? true : p.status === filterStatus));
    if (filterCategory !== "All") list = list.filter((p) => p.category === filterCategory);
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q) || p.seller.name.toLowerCase().includes(q));

    // sorting
    if (sortBy === "footprint-asc") list.sort((a, b) => a.footprint - b.footprint);
    else if (sortBy === "footprint-desc") list.sort((a, b) => b.footprint - a.footprint);
    else if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") list.sort((a, b) => b.id - a.id);

    return list;
  }, [products, query, sortBy, filterCategory, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  // Activity Insights
  const stats = useMemo(() => {
    const pending = products.filter((p) => p.status === "Pending").length;
    const approved = products.filter((p) => p.status === "Approved").length;
    const avgFootprintAll = products.length ? (products.reduce((s, p) => s + (p.footprint || 0), 0) / products.length) : 0;

    // this week approvals - check audit entries in last 7 days
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let thisWeekApprovals = 0;
    products.forEach((p) => {
      (p.audit || []).forEach((a) => {
        if (a.action === "Approved" && new Date(a.ts).getTime() >= oneWeekAgo) thisWeekApprovals++;
      });
    });

    return {
      pending,
      approved,
      avgFootprint: Math.round(avgFootprintAll * 10) / 10,
      thisWeekApprovals,
    };
  }, [products]);

  const pushAudit = (prodId, action, note = "") => {
    const entry = { by: ADMIN_NAME, action, ts: new Date().toISOString(), note };
    setProducts((prev) => prev.map((p) => (p.id === prodId ? { ...p, audit: [...(p.audit || []), entry] } : p)));
  };

  const approveProduct = (id) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Approved" } : p)));
    pushAudit(id, "Approved");
  };
  const rejectProduct = (id, reason = "") => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Rejected" } : p)));
    pushAudit(id, "Rejected", reason);
  };

  const openVerify = (product) => {
    // include suggestion
    const suggested = suggestFootprint(product.category, product.weightKg);
    setEditing({ ...product, suggested });
  };

  const saveVerify = (acceptSuggested = false) => {
    if (!editing) return;
    const val = acceptSuggested ? Number(editing.suggested) : Number(editing.footprint);
    if (Number.isNaN(val) || val < 0) {
      alert("Please enter a valid non-negative number for footprint.");
      return;
    }
    setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, footprint: val } : p)));
    pushAudit(editing.id, "Footprint Verified", `set to ${val}kg`);
    setEditing(null);
  };

  const cancelVerify = () => setEditing(null);

  const openDetails = (product) => setViewing(product);
  const closeDetails = () => setViewing(null);

  const formatKg = (n) => `${n.toLocaleString()} kg CO₂`;

  return (
    <div className="product-approval">
      <header className="pa-header">
        <h2>Product Approval</h2>
        <p className="muted">Review pending product listings and verify carbon footprint</p>
      </header>

      {/* Activity Insights Cards */}
      <div className="insights">
        <div className="card">
          <div className="label">Pending Products</div>
          <div className="value">{stats.pending}</div>
        </div>
        <div className="card">
          <div className="label">Avg. CO₂ Footprint</div>
          <div className="value">{stats.avgFootprint} kg</div>
        </div>
        <div className="card">
          <div className="label">This Week Approvals</div>
          <div className="value">{stats.thisWeekApprovals}</div>
        </div>
      </div>

      <div className="pa-controls">
        <input
          type="text"
          placeholder="Search product or seller..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        />

        <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}>
          {allCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Sort: Newest</option>
          <option value="footprint-asc">Footprint: Low → High</option>
          <option value="footprint-desc">Footprint: High → Low</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      <div className="pa-table-wrap">
        <table className="pa-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Seller</th>
              <th>Price</th>
              <th>Est. Footprint</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr><td colSpan="7" className="empty">No products found for selected filters.</td></tr>
            ) : (
              pageItems.map((p) => (
                <tr key={p.id}>
                  <td className="prod-name">
                    <div className="prod-title" onClick={() => openDetails(p)} style={{cursor:'pointer'}}>{p.name}</div>
                    <div className="prod-notes">{p.notes}</div>
                  </td>
                  <td><span className="cat-tag">{p.category}</span></td>
                  <td>{p.seller.name}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>
                    <span className={`footprint-badge ${p.footprint > 30 ? 'high' : p.footprint > 5 ? 'mid' : 'low'}`}>
                      {formatKg(p.footprint)}
                    </span>
                  </td>
                  <td><span className={`status-tag ${p.status.toLowerCase()}`}>{p.status}</span></td>
                  <td className="actions">
                    <button className="view" onClick={() => openDetails(p)}>View</button>
                    <button className="verify" onClick={() => openVerify(p)}>Verify</button>
                    <button className="approve" onClick={() => approveProduct(p.id)}>Approve</button>
                    <button className="reject" onClick={() => rejectProduct(p.id)}>Reject</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="pa-pagination">
        <button onClick={() => setPage((s) => Math.max(1, s - 1))} disabled={page === 1}>Prev</button>
        <div className="page-info">Page {page} of {totalPages}</div>
        <button onClick={() => setPage((s) => Math.min(totalPages, s + 1))} disabled={page === totalPages}>Next</button>
      </div>

      {/* Footprint Verify Modal */}
      {editing && (
        <div className="modal-overlay" onClick={cancelVerify}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Verify Footprint</h3>
            <p className="muted">Adjust the estimated carbon footprint for <strong>{editing.name}</strong>.</p>

            <label>Estimated Footprint (kg CO₂)</label>
            <input
              type="number"
              value={editing.footprint}
              onChange={(e) => setEditing((prev) => ({ ...prev, footprint: e.target.value }))}
            />

            <div className="assist">
              <div>Suggested based on category & weight: <strong>{editing.suggested} kg</strong></div>
              <button className="use-suggest" onClick={() => saveVerify(true)}>Use Suggested</button>
            </div>

            <div className="modal-actions">
              <button className="btn cancel" onClick={cancelVerify}>Cancel</button>
              <button className="btn save" onClick={() => saveVerify(false)}>Save</button>
            </div>

            {/* Audit trail preview */}
            <div className="audit">
              <h4>Audit Trail</h4>
              <ul>
                {(editing.audit || []).slice().reverse().map((a, i) => (
                  <li key={i}><strong>{a.action}</strong> by {a.by} — {new Date(a.ts).toLocaleString()} {a.note ? `— ${a.note}` : ''}</li>
                ))}
                {!(editing.audit || []).length && <li className="muted">No audit history yet.</li>}
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {viewing && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="details-card" onClick={(e) => e.stopPropagation()}>
            <div className="details-grid">
              <div className="images">
                {viewing.images.map((src, i) => (
                  <img key={i} src={src} alt={`${viewing.name} ${i}`} />
                ))}
              </div>
              <div className="info">
                <h3>{viewing.name}</h3>
                <div className="meta">
                  <span className="cat-tag">{viewing.category}</span>
                  <span className="price">${viewing.price.toFixed(2)}</span>
                </div>
                <p className="desc">{viewing.description}</p>

                <div className="seller-box">
                  <h4>Seller</h4>
                  <p><strong>{viewing.seller.name}</strong> • {viewing.seller.rating} ★</p>
                  <p>Joined: {new Date(viewing.seller.joinDate).toLocaleDateString()}</p>
                  <p>{viewing.seller.email}</p>
                </div>

                <div className="details-actions">
                  <button className="approve" onClick={() => { approveProduct(viewing.id); closeDetails(); }}>Approve</button>
                  <button className="reject" onClick={() => { rejectProduct(viewing.id); closeDetails(); }}>Reject</button>
                  <button className="verify" onClick={() => { openVerify(viewing); closeDetails(); }}>Verify Footprint</button>
                  <button className="close" onClick={closeDetails}>Close</button>
                </div>

                <div className="audit small">
                  <h4>Audit Trail</h4>
                  <ul>
                    {(viewing.audit || []).slice().reverse().map((a, i) => (
                      <li key={i}><strong>{a.action}</strong> by {a.by} — {new Date(a.ts).toLocaleString()} {a.note ? `— ${a.note}` : ''}</li>
                    ))}
                    {!(viewing.audit || []).length && <li className="muted">No audit history yet.</li>}
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="pa-footer muted">Tip: Verify high-footprint products before approving. You can adjust numbers based on seller calculations; an audit trail is kept for every action.</footer>
    </div>
  );
}

