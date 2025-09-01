import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

const defaultUsers = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "alice123", // simple demo password
    role: "consumer",
  },
  {
    name: "John Smith",
    email: "john@example.com",
    password: "john123",
    role: "seller",
  },
  {
    name: "Charlie Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
];

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
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6UwXPnsh0n675cQhcVynTjhLKXWbVY_T_og&s",
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
    image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSvonK3uihASiHftWCiFxW48qgV6DyCmHeHCPAL0LzTrZSmyvkL0a4c9DZmnEwTN95D9zopDMvK1kArFoiVzSeOuoJ-_SmQ93gdy04u-FG2K0gJVO3hSrqIh7DUcqwcHsCcNqKZfAc&usqp=CAc",
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
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkDQx00KuShDNWjGZH4KrvLaey-a72mz-vKw&s",
    date: new Date().toISOString(),
  },
];

export const Authenticate = ({ children }) => {
  const [products, setProducts] = useState(defaultProducts);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState(defaultUsers);
  const [currentUser, setCurrentUser] = useState(null);

  const registerUser = (newUser) => {
    console.log(users);
    setUsers((prev) => [...prev, newUser]);
  }
  const loginUser = (email, password) => {
  const user = users.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    setCurrentUser(user);
    return true;
  }
  return false;
};

const logoutUser = () => {
  setCurrentUser(null);
};

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const addOrder = (product) => {
    const order = {
      id: product.id,
      name: product.name,
      price: product.price,
      ecoScore: product.ecoScore,
      materialCO2: product.materialCO2,
      shippingCO2: product.shippingCO2,
      image: product.image,
      quantity: product.quantity || 1,
      date: product.date || new Date().toISOString(),
    };
    setOrders((prev) => [...prev, order]);
  };

  return (
    <GlobalContext.Provider
      value={{
        users,
        currentUser,
        products,
        cartItems,
        orders,
        setProducts,
        setCartItems,
        setOrders,
        addToCart,
        addOrder,
        registerUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
