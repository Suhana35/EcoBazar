// src/context/GlobalContext.js
import { createContext, useContext, useState } from "react";
// import defaultProducts from "./pages/Consumer/uitils/dummy";

const GlobalContext = createContext();
const defaultProducts = [
    {
        id: 1,
        name: "Men Grey Hoodie",
        type: "Hoodie",
        price: 49.9,
        ecoScore: 4.5,
        footprint: 3.8,
        materialCO2: 2.3,
        shippingCO2: 1.5,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6UwXPnsh0n675cQhcVynTjhLKXWbVY_T_og&s",
    },
    {
        id: 2,
        name: "Women Striped T-Shirt",
        type: "T-Shirt",
        price: 34.9,
        ecoScore: 4.7,
        footprint: 2.5,
        materialCO2: 1.5,
        shippingCO2: 1.0,
        image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSvonK3uihASiHftWCiFxW48qgV6DyCmHeHCPAL0LzTrZSmyvkL0a4c9DZmnEwTN95D9zopDMvK1kArFoiVzSeOuoJ-_SmQ93gdy04u-FG2K0gJVO3hSrqIh7DUcqwcHsCcNqKZfAc&usqp=CAc",
    },
    {
        id: 3,
        name: "Classic Leather Jacket",
        type: "Jacket",
        price: 149.9,
        ecoScore: 3.2,
        footprint: 12.0,
        materialCO2: 9.0,
        shippingCO2: 3.0,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkDQx00KuShDNWjGZH4KrvLaey-a72mz-vKw&s",
    },
    {
        id: 4,
        name: "Denim Blue Jeans",
        type: "Jeans",
        price: 79.9,
        ecoScore: 3.8,
        footprint: 6.5,
        materialCO2: 4.0,
        shippingCO2: 2.5,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6e0GDIiFZyZcVyXDnxRoJ03XgNH1PX0ECnA&s",
        date: new Date().toISOString(),
    },
    {
        id: 5,
        name: "Eco-friendly Sneakers",
        type: "Shoes",
        price: 99.9,
        ecoScore: 4.6,
        footprint: 4.2,
        materialCO2: 3.0,
        shippingCO2: 1.2,
        image: "https://i.imgur.com/T0aWJ3W.png",
        date: new Date().toISOString(),
    },
    {
        id: 6,
        name: "Organic Cotton Dress",
        type: "Dress",
        price: 89.9,
        ecoScore: 4.8,
        footprint: 3.5,
        materialCO2: 2.0,
        shippingCO2: 1.5,
        image: "https://i.imgur.com/1Q9Z1ZL.png",
        date: new Date().toISOString(),
    },
    {
        id: 7,
        name: "Recycled Backpack",
        type: "Bag",
        price: 59.9,
        ecoScore: 4.9,
        footprint: 2.8,
        materialCO2: 1.6,
        shippingCO2: 1.2,
        image: "https://i.imgur.com/qB0pXRY.png",
        date: new Date().toISOString(),
    },
    {
        id: 8,
        name: "Woolen Winter Scarf",
        type: "Accessories",
        price: 39.9,
        ecoScore: 4.2,
        footprint: 2.2,
        materialCO2: 1.2,
        shippingCO2: 1.0,
        image: "https://i.imgur.com/2zi9jzR.png",
        date: new Date().toISOString(),
    },
];

const defaultCartItems = [{
    id: 1,
    name: "Men Grey Hoodie",
    type: "Hoodie",
    price: 49.9,
    ecoScore: 4.5,
    footprint: 3.8,
    materialCO2: 2.3,
    shippingCO2: 1.5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6UwXPnsh0n675cQhcVynTjhLKXWbVY_T_og&s",
    date: new Date().toISOString(),
},
{
    id: 2,
    name: "Women Striped T-Shirt",
    type: "T-Shirt",
    price: 34.9,
    ecoScore: 4.7,
    footprint: 2.5,
    materialCO2: 1.5,
    shippingCO2: 1.0,
    image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSvonK3uihASiHftWCiFxW48qgV6DyCmHeHCPAL0LzTrZSmyvkL0a4c9DZmnEwTN95D9zopDMvK1kArFoiVzSeOuoJ-_SmQ93gdy04u-FG2K0gJVO3hSrqIh7DUcqwcHsCcNqKZfAc&usqp=CAc",
    date: new Date().toISOString(),
},];

const defaultOrders = [{
    id: 1,
    name: "Men Grey Hoodie",
    type: "Hoodie",
    price: 49.9,
    ecoScore: 4.5,
    footprint: 3.8,
    materialCO2: 2.3,
    shippingCO2: 1.5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6UwXPnsh0n675cQhcVynTjhLKXWbVY_T_og&s",
    date: new Date().toISOString(),
},
{
    id: 2,
    name: "Women Striped T-Shirt",
    type: "T-Shirt",
    price: 34.9,
    ecoScore: 4.7,
    footprint: 2.5,
    materialCO2: 1.5,
    shippingCO2: 1.0,
    image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSvonK3uihASiHftWCiFxW48qgV6DyCmHeHCPAL0LzTrZSmyvkL0a4c9DZmnEwTN95D9zopDMvK1kArFoiVzSeOuoJ-_SmQ93gdy04u-FG2K0gJVO3hSrqIh7DUcqwcHsCcNqKZfAc&usqp=CAc",
    date: new Date().toISOString(),
},
{
    id: 3,
    name: "Classic Leather Jacket",
    type: "Jacket",
    price: 149.9,
    ecoScore: 3.2,
    footprint: 12.0,
    materialCO2: 9.0,
    shippingCO2: 3.0,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkDQx00KuShDNWjGZH4KrvLaey-a72mz-vKw&s",
    date: new Date().toISOString(),
},
{
    id: 4,
    name: "Denim Blue Jeans",
    type: "Jeans",
    price: 79.9,
    ecoScore: 3.8,
    footprint: 6.5,
    materialCO2: 4.0,
    shippingCO2: 2.5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6e0GDIiFZyZcVyXDnxRoJ03XgNH1PX0ECnA&s",
    date: new Date().toISOString(),
},];




export const Authenticate = ({ children }) => {
    // 🔹 initialize products with dummy data
    const [products, setProducts] = useState(defaultProducts);
    const [cartItems, setCartItems] = useState(defaultCartItems);
    const [orders, setOrders] = useState(defaultOrders);

    const addToCart = (product) => {
        setCartItems(prevCart => {
            const existing = prevCart.find(p => p.id === product.id);
            if (existing) {
                return prevCart.map(p =>
                    p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    // Checkout handler (for CartPage)
   

    const addOrder = (product) => {
    setOrders((prevOrders) => [...prevOrders, product]);
  };




    //     // 🔹 dummy users
    //     const [users, setUsers] = useState([
    //         {
    //             id: 1,
    //             name: "Alice Johnson",
    //             email: "alice@example.com",
    //             password: "12345",
    //             role: "Buyer",
    //             status: "Active",
    //         },
    //         {
    //             id: 2,
    //             name: "Bob Smith",
    //             email: "bob@example.com",
    //             password: "12345",
    //             role: "Seller",
    //             status: "Active",
    //         },
    //         {
    //             id: 3,
    //             name: "Charlie Admin",
    //             email: "admin@example.com",
    //             password: "admin123",
    //             role: "Admin",
    //             status: "Active",
    //         },
    //     ]);

    //     const [currentUser, setCurrentUser] = useState(null); // logged in user
    //     const [cartItems, setCartItems] = useState([]);

    //     // 🔹 dummy orders
    //     const [orders, setOrders] = useState([
    //         {
    //             id: 101,
    //             product: {
    //                 id: 1,
    //                 name: "Men Grey Hoodie",
    //                 price: 49.9,
    //                 carbonFootprint: 3.8,
    //             },
    //             buyer: { name: "Alice Johnson", email: "alice@example.com" },
    //             quantity: 2,
    //             date: new Date().toISOString(),
    //             seller: "Bob Smith",
    //             category: "Hoodie",
    //         },
    //         {
    //             id: 102,
    //             product: {
    //                 id: 2,
    //                 name: "Women Striped T-Shirt",
    //                 price: 34.9,
    //                 carbonFootprint: 2.5,
    //             },
    //             buyer: { name: "Alice Johnson", email: "alice@example.com" },
    //             quantity: 1,
    //             date: new Date().toISOString(),
    //             seller: "Bob Smith",
    //             category: "T-Shirt",
    //         },
    //     ]);

    //     // ----------------- User Functions -----------------
    //     const registerUser = (userData) => {
    //         const exists = users.some((u) => u.email === userData.email);
    //         if (exists) return false;
    //         setUsers((prev) => [...prev, { ...userData, id: Date.now() }]);
    //         return true;
    //     };

    //     const loginUser = (email, password) => {
    //         const foundUser = users.find(
    //             (u) => u.email === email && u.password === password
    //         );
    //         if (foundUser) {
    //             setCurrentUser(foundUser);
    //             return foundUser;
    //         }
    //         return null;
    //     };

    //     const logoutUser = () => setCurrentUser(null);

    //     const updateUser = (updatedUser) => {
    //         setUsers((prev) =>
    //             prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    //         );
    //     };

    //     // ----------------- Cart Functions -----------------
    //     const addToCart = (product) => {
    //         setCartItems((prev) => {
    //             const existing = prev.find((item) => item.id === product.id);
    //             if (existing) {
    //                 return prev.map((item) =>
    //                     item.id === product.id
    //                         ? { ...item, quantity: (item.quantity || 1) + 1 }
    //                         : item
    //                 );
    //             } else {
    //                 return [...prev, { ...product, quantity: 1 }];
    //             }
    //         });
    //     };

    //     const removeFromCart = (id) =>
    //         setCartItems((prev) => prev.filter((item) => item.id !== id));

    //     const clearCart = () => setCartItems([]);

    //     // ----------------- Order Functions -----------------
    //     const addOrder = (order) => {
    //         setOrders((prev) => [...prev, order]);
    //         clearCart();
    //     };

    //     // GlobalContext.js
    //     const checkout = (items = cartItems) => {
    //         if (!currentUser) return null; // must be logged in

    //         const date = new Date();
    //         // inside checkout()
    // const newOrders = items.map((item) => ({
    //     id: Date.now() + Math.random(),
    //     product: {
    //         id: item.id,
    //         name: item.name,
    //         price: item.price,
    //         ecoScore: item.ecoScore,
    //         carbonFootprint: item.carbonFootprint,
    //         category: item.category,
    //         seller: item.seller,
    //         image: item.image,
    //     },
    //     buyer: { name: currentUser.name, email: currentUser.email },
    //     quantity: item.quantity || 1,
    //     total: item.price * (item.quantity || 1),
    //     date: date.toISOString(),
    // }));


    //         setOrders((prev) => [...prev, ...newOrders]);
    //         setCartItems([]); // clear cart
    //         return newOrders; // useful for showing in popup
    //     };





    //     // ----------------- Product Functions -----------------
    //     const addProduct = (product) => {
    //         setProducts((prev) => [...prev, { ...product, id: Date.now() }]);
    //     };

    //     const removeProduct = (id) => {
    //         setProducts((prev) => prev.filter((p) => p.id !== id));
    //     };

    //     const updateProduct = (updatedProduct) => {
    //         setProducts((prev) =>
    //             prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    //         );
    //     };
    return (
        <GlobalContext.Provider
            value={{
                        products,
                        cartItems,
                        orders,
                        setProducts,
                        setCartItems,
                        setOrders,
                        addToCart,
                        addOrder,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );

    // return (
    //     <GlobalContext.Provider
    //         value={{
    //             users,
    //             currentUser,
    //             cartItems,
    //             orders,
    //             products,
    //             registerUser,
    //             loginUser,
    //             logoutUser,
    //             addToCart,
    //             removeFromCart,
    //             clearCart,
    //             addOrder,
    //             checkout,
    //             addProduct,
    //             removeProduct,
    //             updateProduct,
    //             updateUser,
    //             setCartItems,
    //         }}
    //     >
    //         {children}
    //     </GlobalContext.Provider>
    // );
};

export const useGlobal = () => useContext(GlobalContext);
