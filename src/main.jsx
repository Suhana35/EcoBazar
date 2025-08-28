import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Authenticate } from "./Global";// make sure path is correct

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Authenticate>
      <App />
    </Authenticate>
  </BrowserRouter>
);

