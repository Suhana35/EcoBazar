import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Authenticate } from "./Global";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Authenticate>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </Authenticate>
  </React.StrictMode>
);
