// src/context/GlobalContext.js
import { createContext, useContext, useState } from "react";
import defaultProducts from "./pages/Consumer/uitils/dummy";

const GlobalContext = createContext();

export const Authenticate = ({ children }) => {
    // 🔹 initialize products with dummy data
    const [products, setProducts] = useState(defaultProducts);

    // 🔹 dummy users
    const [users, setUsers] = useState([
        {
            id: 1,
            name: "Alice Johnson",
            email: "alice@example.com",
            password: "12345",
            role: "Buyer",
            status: "Active",
        },
        {
            id: 2,
            name: "Bob Smith",
            email: "bob@example.com",
            password: "12345",
            role: "Seller",
            status: "Active",
        },
        {
            id: 3,
            name: "Charlie Admin",
            email: "admin@example.com",
            password: "admin123",
            role: "Admin",
            status: "Active",
        },
    ]);

    const [currentUser, setCurrentUser] = useState(null); // logged in user
    const [cartItems, setCartItems] = useState([]);

    // 🔹 dummy orders
    const [orders, setOrders] = useState([
        {
            id: 101,
            product: {
                id: 1,
                name: "Men Grey Hoodie",
                price: 49.9,
                carbonFootprint: 3.8,
            },
            buyer: { name: "Alice Johnson", email: "alice@example.com" },
            quantity: 2,
            date: new Date().toISOString(),
            seller: "Bob Smith",
            category: "Hoodie",
        },
        {
            id: 102,
            product: {
                id: 2,
                name: "Women Striped T-Shirt",
                price: 34.9,
                carbonFootprint: 2.5,
            },
            buyer: { name: "Alice Johnson", email: "alice@example.com" },
            quantity: 1,
            date: new Date().toISOString(),
            seller: "Bob Smith",
            category: "T-Shirt",
        },
    ]);

    // ----------------- User Functions -----------------
    const registerUser = (userData) => {
        const exists = users.some((u) => u.email === userData.email);
        if (exists) return false;
        setUsers((prev) => [...prev, { ...userData, id: Date.now() }]);
        return true;
    };

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

    const logoutUser = () => setCurrentUser(null);

    const updateUser = (updatedUser) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
    };

    // ----------------- Cart Functions -----------------
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

    const removeFromCart = (id) =>
        setCartItems((prev) => prev.filter((item) => item.id !== id));

    const clearCart = () => setCartItems([]);

    // ----------------- Order Functions -----------------
    const addOrder = (order) => {
        setOrders((prev) => [...prev, order]);
        clearCart();
    };

    // GlobalContext.js
    const checkout = (items = cartItems) => {
        if (!currentUser) return null; // must be logged in

        const date = new Date();
        // inside checkout()
const newOrders = items.map((item) => ({
    id: Date.now() + Math.random(),
    product: {
        id: item.id,
        name: item.name,
        price: item.price,
        ecoScore: item.ecoScore,
        carbonFootprint: item.carbonFootprint,
        category: item.category,
        seller: item.seller,
        image: item.image,
    },
    buyer: { name: currentUser.name, email: currentUser.email },
    quantity: item.quantity || 1,
    total: item.price * (item.quantity || 1),
    date: date.toISOString(),
}));


        setOrders((prev) => [...prev, ...newOrders]);
        setCartItems([]); // clear cart
        return newOrders; // useful for showing in popup
    };





    // ----------------- Product Functions -----------------
    const addProduct = (product) => {
        setProducts((prev) => [...prev, { ...product, id: Date.now() }]);
    };

    const removeProduct = (id) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    const updateProduct = (updatedProduct) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
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
                checkout,
                addProduct,
                removeProduct,
                updateProduct,
                updateUser,
                setCartItems,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => useContext(GlobalContext);
