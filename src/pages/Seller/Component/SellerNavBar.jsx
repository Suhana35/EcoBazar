import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobal } from "../../../Global";
import { FaUserCircle } from "react-icons/fa";
import "../styles/SellerNavBar.css";

const SellerNavBar = () => {
  const { currentUser, logoutUser } = useGlobal();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="seller-navbar">
      <div className="logo">
        <Link to="/seller">EcoBazaar Seller</Link>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/selAddProduct">Add Product</Link>
        </li>
        <li>
          <Link to="/selProducts">Product Catalog</Link>
        </li>
        <li>
          <Link to="/salesOrders">Sales Orders</Link>
        </li>
        <li>
          <Link to="/carbonReports">Carbon Reports</Link>
        </li>
      </ul>

      <div className="user-section">
        {!currentUser ? (
          <div className="auth-buttons">
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/")}>Register</button>
          </div>
        ) : (
          <div className="profile-container">
            <FaUserCircle
              className="profile-icon"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <p>Hello, {currentUser.name}</p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default SellerNavBar;
