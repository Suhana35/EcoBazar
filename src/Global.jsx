// src/context/GlobalContext.js
import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const Authenticate = ({ children }) => {

    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]); // all registered users
    const [currentUser, setCurrentUser] = useState(null); // logged in user
    const [cartItems, setCartItems] = useState([]);

    // 🔹 Orders state
    const [orders, setOrders] = useState([]);
    // Register new user (prevent duplicates)
    const registerUser = (userData) => {
        const exists = users.some((u) => u.email === userData.email);
        if (exists) return false;
        setUsers((prev) => [...prev, userData]);
        return true;
    };

    // Login user
    const loginUser = (email, password) => {
        const foundUser = users.find(
            (u) => u.email === email && u.password === password
        );
        if (foundUser) {
            setCurrentUser(foundUser);
            return foundUser;
        }
        return null;
    };

    // Logout user
    const logoutUser = () => {
        setCurrentUser(null);
    };

    // ---- Cart functions ----
    const addToCart = (product) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: (item.quantity || 1) + 1 }
                        : item
                );
            } else {
                return [...prev, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => setCartItems([]);

    // ---- Order functions ----
    const addOrder = (order) => {
        setOrders((prev) => [...prev, order]);
        clearCart();
    };
    const checkout = () => {
  if (cartItems.length === 0) return;

  const newOrders = cartItems.map(p => ({
    id: Date.now() + Math.random(),
    product: {
      id: p.id,
      name: p.name,
      price: p.price || 0,
      carbonFootprint: p.carbonFootprint || 0,
    },
    buyer: currentUser
      ? { name: currentUser.name, email: currentUser.email }
      : { name: "Guest", email: "guest@example.com" },
    quantity: p.quantity || 1,
    date: new Date().toISOString(),
    seller: p.seller || "Unknown",
    category: p.category || "General",
  }));

  setOrders(prev => [...prev, ...newOrders]);
  setCartItems([]); 
  alert("Order Placed Successfully! ✅");
};


   

    // Add a new product
    const addProduct = (product) => {
        setProducts((prev) => [...prev, { ...product, id: Date.now() }]);
    };

    // Remove product
    const removeProduct = (id) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    // Update product
    const updateProduct = (updatedProduct) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
    };

    // Update user
const updateUser = (updatedUser) => {
  setUsers((prev) =>
    prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
  );
};



    return (
        <GlobalContext.Provider
            value={{
                users,
                currentUser,
                cartItems,
                orders,
                products,
                registerUser,
                loginUser,
                logoutUser,
                addToCart,
                removeFromCart,
                clearCart,
                addOrder,
                setCartItems,
                checkout,
                addProduct,     
                removeProduct,  
                updateProduct,
                 updateUser,   
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => useContext(GlobalContext);
