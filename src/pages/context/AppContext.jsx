// src/context/AppContext.jsx
import React, { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Men Grey Hoodie",
      type: "Hoodie",
      inventory: 9,
      price: 49.9,
      footprint: 5.0,
      votes: 32,
      image: "https://i.imgur.com/kYCMkX4.png",
      sellerId: 101,
    },
    {
      id: 2,
      name: "Women Striped T-Shirt",
      type: "T-Shirt",
      inventory: 14,
      price: 34.9,
      footprint: 3.1,
      votes: 24,
      image: "https://i.imgur.com/G5g2rG2.png",
      sellerId: 102,
    },
  ]);

  const [users, setUsers] = useState([
    { id: 101, name: "Seller Alice", role: "seller", status: "active", email: "alice@seller.com" },
    { id: 102, name: "Seller Bob", role: "seller", status: "active", email: "bob@seller.com" },
    { id: 201, name: "Buyer John", role: "buyer", status: "active", email: "john@buyer.com" },
    { id: 1, name: "Admin", role: "admin", status: "active", email: "admin@site.com" },
  ]);

  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(users[2]); // Buyer John by default

  // ---- Product ----
  const addProduct = (payload) => {
    const newProduct = { ...payload, id: Date.now() };
    setProducts((p) => [newProduct, ...p]);
    return newProduct;
  };

  // ---- Cart ----
  const addToCart = (product, qty = 1) => {
    setCart((c) => {
      const exists = c.find((x) => x.product.id === product.id);
      if (exists) {
        return c.map((x) =>
          x.product.id === product.id
            ? { ...x, quantity: x.quantity + qty }
            : x
        );
      }
      return [...c, { product, quantity: qty }];
    });
  };
  const clearCart = () => setCart([]);

  // ---- Orders ----
  const placeOrder = ({ buyer, cartItems }) => {
    const createdAt = new Date().toISOString();
    const newOrders = cartItems.map((ci) => ({
      id: Date.now() + Math.floor(Math.random() * 1000),
      productId: ci.product.id,
      sellerId: ci.product.sellerId,
      buyer: {
        id: buyer?.id ?? null,
        name: buyer?.name ?? "Guest",
        email: buyer?.email ?? "",
      },
      quantity: ci.quantity,
      price: ci.product.price,
      createdAt,
    }));
    setOrders((o) => [...newOrders, ...o]);
    return newOrders;
  };
  const getOrdersForSeller = (sellerId) =>
    orders.filter((o) => o.sellerId === sellerId);

  // ---- Users ----
  const updateUserStatus = (id, patch) =>
    setUsers((s) => s.map((u) => (u.id === id ? { ...u, ...patch } : u)));

  return (
    <AppContext.Provider
      value={{
        products,
        addProduct,
        users,
        updateUserStatus,
        orders,
        placeOrder,
        getOrdersForSeller,
        cart,
        addToCart,
        clearCart,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be inside AppProvider");
  return ctx;
};
