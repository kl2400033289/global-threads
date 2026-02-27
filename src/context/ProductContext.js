import { createContext, useState, useEffect } from "react";

import sareeImg from "../assets/saree.webp";
import kurtaImg from "../assets/kurta.webp";
import dupattaImg from "../assets/dupatta.webp";

export const ProductContext = createContext();

const defaultProducts = [
  {
    id: 1,
    name: "Handloom Saree",
    price: 2499,
    image: sareeImg,
    rating: 4.5,
    reviews: [],
  },
  {
    id: 2,
    name: "Cotton Kurta",
    price: 1499,
    image: kurtaImg,
    rating: 3.2,
    reviews: [],
  },
  {
    id: 3,
    name: "Silk Dupatta",
    price: 899,
    image: dupattaImg,
    rating: 4.0,
    reviews: [],
  },
  {
    id: 4,
    name: "Banarasi Zari Saree",
    price: 3299,
    image: sareeImg,
    rating: 4.7,
    reviews: [],
  },
  {
    id: 5,
    name: "Indigo Block Kurta",
    price: 1899,
    image: kurtaImg,
    rating: 4.1,
    reviews: [],
  },
  {
    id: 6,
    name: "Phulkari Silk Dupatta",
    price: 1199,
    image: dupattaImg,
    rating: 4.3,
    reviews: [],
  },
  {
    id: 7,
    name: "Kanjivaram Festive Saree",
    price: 2799,
    image: sareeImg,
    rating: 4.4,
    reviews: [],
  },
  {
    id: 8,
    name: "Classic Cotton Kurta Set",
    price: 1399,
    image: kurtaImg,
    rating: 3.9,
    reviews: [],
  },
  {
    id: 9,
    name: "Bandhani Designer Dupatta",
    price: 999,
    image: dupattaImg,
    rating: 4.2,
    reviews: [],
  },
];

const dedupeProductsById = (items = []) => {
  const productMap = new Map();

  items.forEach((product) => {
    if (!productMap.has(product.id)) {
      productMap.set(product.id, product);
    }
  });

  return Array.from(productMap.values());
};

export function ProductProvider({ children }) {
  // ✅ load from localStorage only once on first render
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("products");

      if (saved) {
        const parsedProducts = JSON.parse(saved);
        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          return dedupeProductsById(parsedProducts);
        }
      }

      return dedupeProductsById(defaultProducts);
    } catch {
      return dedupeProductsById(defaultProducts);
    }
  });

  // ✅ auto save
  useEffect(() => {
    const dedupedProducts = dedupeProductsById(products);

    if (dedupedProducts.length !== products.length) {
      setProducts(dedupedProducts);
      return;
    }

    localStorage.setItem("products", JSON.stringify(dedupedProducts));
  }, [products]);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
}