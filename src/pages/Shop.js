import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";
import "./Shop.css";

function Shop() {
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  // 🔒 Protected Add to Cart
  const handleAddToCart = (product) => {
  if (!user) {
    toast.error(t("shop.loginToAdd"));
    navigate("/login");
    return;
  }

  addToCart(product);
  toast.success(t("shop.addedToCart"));
};

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return a.price - b.price;
      }

      if (sortBy === "price-high") {
        return b.price - a.price;
      }

      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }

      return a.id - b.id;
    });

  return (
    <div className="shop-page">
      <h1 className="shop-title">🛍 {t("shop.title")}</h1>
      <p className="shop-subtitle">
        {t("shop.subtitle")}
      </p>

      <div className="shop-controls">
        <input
          type="text"
          placeholder={t("shop.searchPlaceholder")}
          className="shop-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="shop-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="featured">{t("shop.sortFeatured")}</option>
          <option value="price-low">{t("shop.sortPriceLow")}</option>
          <option value="price-high">{t("shop.sortPriceHigh")}</option>
          <option value="rating">{t("shop.sortRating")}</option>
        </select>
      </div>

      <p className="results-count">{filteredProducts.length} {t("shop.itemsAvailable")}</p>

      {filteredProducts.length === 0 ? (
        <p className="empty-text">{t("shop.noProducts")}</p>
      ) : (
        <div className="shop-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="shop-card">
              <div className="image-wrap">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/300x300?text=Product")
                  }
                />
              </div>

              <h3>{product.name}</h3>
              <p className="price">{formatPrice(product.price)}</p>
              <p className="shop-rating">⭐ {(product.rating || 0).toFixed(1)}</p>

              <button
                className="add-btn"
                onClick={() => handleAddToCart(product)}
              >
                {t("shop.addToCart")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Shop;