import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser } from "react-icons/fi";
// import { useGlobal } from "../../Global";
// import "./Navbar.css"; // we'll style with CSS
import "../styles/Navbar.css";
import { useGlobal } from "../../../Global";

const Navbar = () => {
  const { cartItems, currentUser, logoutUser } = useGlobal();
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/home" className="logo">🌱 EcoBazaarX</Link>
        <Link to="/home">Home</Link>
        <Link to="/orders">Orders</Link>
      </div>

      <div className="nav-right">
        {/* Cart */}
        <Link to="/cart" className="cart-icon">
          <FiShoppingCart size={22} />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>

        {/* If not logged in → show Login/Register */}
        {!currentUser ? (
          <div className="auth-buttons">
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/")}>Register</button>
          </div>
        ) : (
          // If logged in → show Profile + Logout
          <div className="profile-menu">
            <FiUser size={22} />
            <span>{currentUser.name}</span>
            <button onClick={logoutUser} className="logout-btn">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
