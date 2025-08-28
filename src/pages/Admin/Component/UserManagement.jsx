import React, { useState } from "react";
import "../styles/UserManagement.css";

const initialUsers = [
  { id: 1, name: "Alice Johnson", role: "Buyer", status: "Active" },
  { id: 2, name: "Bob Smith", role: "Seller", status: "Blocked" },
  { id: 3, name: "Charlie Brown", role: "Buyer", status: "Active" },
  { id: 4, name: "David Lee", role: "Seller", status: "Active" },
  { id: 5, name: "Eva Green", role: "Buyer", status: "Blocked" },
  { id: 6, name: "Frank White", role: "Seller", status: "Active" },
  { id: 7, name: "Grace Miller", role: "Buyer", status: "Active" },
  { id: 8, name: "Henry Adams", role: "Seller", status: "Blocked" },
];

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // --- Filtered & Searched Users ---
  const filteredUsers = users.filter((u) => {
    return (
      (filterRole === "All" || u.role === filterRole) &&
      (filterStatus === "All" || u.status === filterStatus) &&
      u.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  // --- Pagination Logic ---
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // --- Actions ---
  const toggleStatus = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: u.status === "Active" ? "Blocked" : "Active" } : u
      )
    );
  };

  const toggleRole = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, role: u.role === "Buyer" ? "Seller" : "Buyer" } : u
      )
    );
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>

      {/* Search & Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="All">All Roles</option>
          <option value="Buyer">Buyer</option>
          <option value="Seller">Seller</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      {/* User Table */}
      <table className="user-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>
                  <span className={`role-badge ${u.role.toLowerCase()}`}>{u.role}</span>
                </td>
                <td>
                  <span className={`status-badge ${u.status.toLowerCase()}`}>
                    {u.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => setSelectedUser(u)} className="view-btn">👁 View</button>
                  <button onClick={() => toggleStatus(u.id)} className="block-btn">
                    {u.status === "Active" ? "Block" : "Unblock"}
                  </button>
                  <button onClick={() => toggleRole(u.id)} className="promote-btn">
                    {u.role === "Buyer" ? "Promote" : "Demote"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Profile Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedUser.name}'s Profile</h3>
            <p><strong>User ID:</strong> {selectedUser.id}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>Status:</strong> {selectedUser.status}</p>
            <p><strong>Email:</strong> {selectedUser.name.split(" ")[0].toLowerCase()}@mail.com</p>
            <p><strong>Joined:</strong> Jan 2024</p>
            <button onClick={() => setSelectedUser(null)} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
