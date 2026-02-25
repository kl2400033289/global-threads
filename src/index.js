import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { LanguageProvider } from "./context/LanguageContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { ThemeProvider } from "./context/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <LanguageProvider>
  <ThemeProvider>
    <CartProvider>
      <ProductProvider>
        <AuthProvider>
          <OrderProvider>
            <App />
          </OrderProvider>
        </AuthProvider>
      </ProductProvider>
    </CartProvider>
  </ThemeProvider>
</LanguageProvider>
);

