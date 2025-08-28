// File: ProductApproval.jsx
// Admin Product Approval page — upgraded with:
// - Product Details Modal / Preview (images, description, seller info)
// - Audit Trail / History (who approved/rejected and when)
// - Footprint Verification Assistance (auto-suggest based on category + weight)
// - Category & Status filters (Pending/Approved/Rejected + categories)
// - Activity Insights (cards above table)

import React, { useState, useMemo } from "react";
import "../styles/ProductApproval.css";
import { useGlobal } from "../../../Global";

const ADMIN_NAME = "AdminUser";

// Heuristic footprint suggestion
function suggestFootprint(category, weightKg) {
  const factors = { Clothing: 25, Electronics: 300, Home: 40, Other: 50 };
  const factor = factors[category] ?? factors.Other;
  const suggested = Math.max(0.1, (weightKg || 0.1) * factor * 0.1);
  return Math.round(suggested * 10) / 10;
}

export default function ProductApproval() {
  const { products, updateProduct } = useGlobal();

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 6;
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("Pending");

  // categories
  const allCategories = useMemo(() => {
    const setCats = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(setCats)];
  }, [products]);

  // filtered products
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) =>
      filterStatus === "All" ? true : p.status === filterStatus
    );
    if (filterCategory !== "All")
      list = list.filter((p) => p.category === filterCategory);
    if (q)
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.seller?.name?.toLowerCase().includes(q)
      );

    if (sortBy === "footprint-asc") list.sort((a, b) => a.footprint - b.footprint);
    else if (sortBy === "footprint-desc") list.sort((a, b) => b.footprint - a.footprint);
    else if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") list.sort((a, b) => b.id - a.id);

    return list;
  }, [products, query, sortBy, filterCategory, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  // stats
  const stats = useMemo(() => {
    const pending = products.filter((p) => p.status === "Pending").length;
    const approved = products.filter((p) => p.status === "Approved").length;
    const avgFootprintAll = products.length
      ? products.reduce((s, p) => s + (p.footprint || 0), 0) / products.length
      : 0;

    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let thisWeekApprovals = 0;
    products.forEach((p) =>
      (p.audit || []).forEach((a) => {
        if (a.action === "Approved" && new Date(a.ts).getTime() >= oneWeekAgo)
          thisWeekApprovals++;
      })
    );

    return {
      pending,
      approved,
      avgFootprint: Math.round(avgFootprintAll * 10) / 10,
      thisWeekApprovals,
    };
  }, [products]);

  // --- actions ---
  const pushAudit = (product, action, note = "") => {
    const entry = { by: ADMIN_NAME, action, ts: new Date().toISOString(), note };
    updateProduct({
      ...product,
      audit: [...(product.audit || []), entry],
    });
  };

  const approveProduct = (p) => {
    updateProduct({ ...p, status: "Approved" });
    pushAudit(p, "Approved");
  };

  const rejectProduct = (p, reason = "") => {
    updateProduct({ ...p, status: "Rejected" });
    pushAudit(p, "Rejected", reason);
  };

  const openVerify = (product) => {
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
    updateProduct({ ...editing, footprint: val });
    pushAudit(editing, "Footprint Verified", `set to ${val}kg`);
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

