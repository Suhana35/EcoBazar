import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from "./pages/RegistrationForm";
import Login from "./pages/Login";
import Home from "./pages/Consumer/Component/Home";
import ProductDetails from "./pages/Consumer/Component/ProductDetails";
import OrderHistory from "./pages/Consumer/Component/OrderHistory";
import ProductCart from "./pages/Consumer/Component/ProductCart";

import AddProduct from "./pages/Seller/Component/AddProduct";
import ProductCatalog from "./pages/Seller/Component/ProductCatalog";
import SellerDashboard from "./pages/Seller/Component/SellerDashboard";
import SalesOrders from "./pages/Seller/Component/SalesOrders";
import CarbonReports from "./pages/Seller/Component/CarbonReports";

import AdminDashboard from "./pages/Admin/Component/AdminDashboard";
import UserManagement from "./pages/Admin/Component/UserManagement";
import ProductApproval from "./pages/Admin/Component/ProductApproval";
import AdminCarbonReports from "./pages/Admin/Component/CarbonReports";
import { Authenticate } from "./Global";


function App() {

  // const [cartItems, setCartItems] = useState([{
  //   id: 1,
  //   name: "Men Grey Hoodie",
  //   type: "Hoodie",
  //   price: 49.9,
  //   ecoScore: 4.5,
  //   footprint: 3.8,
  //   materialCO2: 2.3,
  //   shippingCO2: 1.5,
  //   image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6UwXPnsh0n675cQhcVynTjhLKXWbVY_T_og&s",
  //   date: new Date().toISOString(),
  // },
  // {
  //   id: 2,
  //   name: "Women Striped T-Shirt",
  //   type: "T-Shirt",
  //   price: 34.9,
  //   ecoScore: 4.7,
  //   footprint: 2.5,
  //   materialCO2: 1.5,
  //   shippingCO2: 1.0,
  //   image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSvonK3uihASiHftWCiFxW48qgV6DyCmHeHCPAL0LzTrZSmyvkL0a4c9DZmnEwTN95D9zopDMvK1kArFoiVzSeOuoJ-_SmQ93gdy04u-FG2K0gJVO3hSrqIh7DUcqwcHsCcNqKZfAc&usqp=CAc",
  //   date: new Date().toISOString(),
  // },]);
  // const addToCart = (product) => {
  //   setCartItems(prevCart => {
  //     const existing = prevCart.find(p => p.id === product.id);
  //     if (existing) {
  //       return prevCart.map(p =>
  //         p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
  //       );
  //     } else {
  //       return [...prevCart, { ...product, quantity: 1 }];
  //     }
  //   });
  // };

  // Checkout handler (for CartPage)
  // const handleCheckout = (cartProducts) => {
  //   const newOrders = cartProducts.map(p => ({ ...p, date: new Date().toISOString() }));
  //   setOrders((prev) => [...prev, ...newOrders]);
  //   setCartItems([]); // Clear cart after checkout
  //   alert("Order Placed Successfully! ✅");
  // };
  const [products, setProducts] = useState([]);
   const [orders, setOrders] = useState([
  // {
  //   id: 1,
  //   name: "Men Grey Hoodie",
  //   type: "Hoodie",
  //   price: 49.9,
  //   ecoScore: 4.5,
  //   footprint: 3.8,
  //   materialCO2: 2.3,
  //   shippingCO2: 1.5,
  //   image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6UwXPnsh0n675cQhcVynTjhLKXWbVY_T_og&s",
  //   date: new Date().toISOString(),
  // },
  // {
  //   id: 2,
  //   name: "Women Striped T-Shirt",
  //   type: "T-Shirt",
  //   price: 34.9,
  //   ecoScore: 4.7,
  //   footprint: 2.5,
  //   materialCO2: 1.5,
  //   shippingCO2: 1.0,
  //   image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSvonK3uihASiHftWCiFxW48qgV6DyCmHeHCPAL0LzTrZSmyvkL0a4c9DZmnEwTN95D9zopDMvK1kArFoiVzSeOuoJ-_SmQ93gdy04u-FG2K0gJVO3hSrqIh7DUcqwcHsCcNqKZfAc&usqp=CAc",
  //   date: new Date().toISOString(),
  // },
  // {
  //   id: 3,
  //   name: "Classic Leather Jacket",
  //   type: "Jacket",
  //   price: 149.9,
  //   ecoScore: 3.2,
  //   footprint: 12.0,
  //   materialCO2: 9.0,
  //   shippingCO2: 3.0,
  //   image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkDQx00KuShDNWjGZH4KrvLaey-a72mz-vKw&s",
  //   date: new Date().toISOString(),
  // },
  // {
  //   id: 4,
  //   name: "Denim Blue Jeans",
  //   type: "Jeans",
  //   price: 79.9,
  //   ecoScore: 3.8,
  //   footprint: 6.5,
  //   materialCO2: 4.0,
  //   shippingCO2: 2.5,
  //   image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6e0GDIiFZyZcVyXDnxRoJ03XgNH1PX0ECnA&s",
  //   date: new Date().toISOString(),
  // },
  //
   ]); // ✅ global orders state

  // function to add an order
  const addOrder = (product) => {
    setOrders((prevOrders) => [...prevOrders, product]);
  };


  return (
 <Authenticate>
    <Routes>
      <Route path="/" element={<RegistrationForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home products={products} />} />
      <Route path="/productInfo/:productId" element={<ProductDetails  products={products} />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/cart" element={<ProductCart />} />

      <Route path="/selAddProduct" element={<AddProduct  />} />
      <Route path="/selProducts" element={<ProductCatalog/>} />
      <Route path="/seller" element={<SellerDashboard />} />
      <Route path="/salesOrders" element={<SalesOrders/>}/>
      <Route path="/carbonReports" element={<CarbonReports />} />

       <Route path="/admin" element={<AdminDashboard />} />
       <Route path="/userManagement" element={<UserManagement />} />
       <Route path="/productApproval" element={<ProductApproval />} />
       <Route path="/adminReports" element={<AdminCarbonReports />} />
    </Routes>
    </Authenticate>

  );
}

export default App;
