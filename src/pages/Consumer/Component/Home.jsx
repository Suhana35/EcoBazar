import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiStar, FiShoppingCart } from "react-icons/fi";
import "../styles/ProductCatalog.css";
import { FaHome } from "react-icons/fa";

const Home = ({ products = [], addToCart }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Default demo products with carbon footprint + eco score


  const allProducts = [...products];

  // Filter products
  let filteredProducts = allProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? p.type === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  if (sortBy === "priceLowHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceHighLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "ecoScore") {
    filteredProducts.sort((a, b) => b.ecoScore - a.ecoScore);
  } else if (sortBy === "footprint") {
    filteredProducts.sort((a, b) => a.footprint - b.footprint);
  }

  // Add to Cart action
  // const addToCart = (id) => {
  //   navigate("/cart")
  //   // alert(`Product ${id} added to cart!`);
  //   // Later: navigate("/cart") or update global cart context
  // };

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h2>EcoBazarX – Home</h2>
      </div>

      {/* Filters */}
      <div className="filters-bar card">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-options">
          <select onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">Category: All</option>
            <option value="Hoodie">Hoodie</option>
            <option value="T-Shirt">T-Shirt</option>
            <option value="Jacket">Jacket</option>
            <option value="Jeans">Jeans</option>
          </select>

          <select onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort: Default</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="ecoScore">Eco Score</option>
            <option value="footprint">Lowest Footprint</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map((p) => (
          <div key={p.id} className="product-card card">
            <img src={p.image} alt={p.name} className="product-img" onClick={() => navigate(`/productInfo/${p.id}`)} />
            <h3 onClick={() => navigate(`/productInfo/${p.id}`)}>{p.name}</h3>
            <p className="product-type">{p.type}</p>
            <p className="product-price">${p.price.toFixed(2)}</p>

            {/* Carbon footprint & eco score */}
            <p className="footprint">
              🌍 Carbon Footprint: {p.footprint} kg CO₂e
            </p>
            <p className="eco-score">
              Eco Score: {p.ecoScore} / 5{" "}
              <FiStar className="star-icon" color="green" />
            </p>

            <button
              className="add-to-cart-btn"
              onClick={() =>{ addToCart(p); navigate("/cart")}}
            >
              <FiShoppingCart /> Add to Cart
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
