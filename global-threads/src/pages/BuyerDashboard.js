import { useContext, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { CartContext } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";
import "./BuyerDashboard.css";

function BuyerDashboard() {
  const { products, setProducts } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { t } = useLanguage();

  const [reviewProductId, setReviewProductId] = useState(null);
  const [rating, setRating] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("top-rated");

  const [comment, setComment] = useState("");
  const [customProduct, setCustomProduct] = useState(null);
  const [customMsg, setCustomMsg] = useState("");

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const displayProducts = products
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

      return (b.rating || 0) - (a.rating || 0);
    });

  // ⭐ open review modal
  const openReview = (productId) => {
    setReviewProductId(productId);
  };

  // ⭐ submit review
  const submitReview = () => {
    if (comment.trim().length < 4) {
      toast.error(t("buyer.reviewTooShort"));
      return;
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewProductId) {
          const newReviews = [...(p.reviews || []), { rating, comment }];

          const avgRating =
            newReviews.reduce((sum, review) => sum + review.rating, 0) /
            newReviews.length;

          return {
            ...p,
            reviews: newReviews,
            rating: avgRating,
          };
        }
        return p;
      })
    );

    setReviewProductId(null);
    setComment("");
    toast.success(t("buyer.reviewThanks"));
  };

  // 🎨 customization
  const requestCustomization = (product) => {
    setCustomProduct(product);
  };

  return (
    <div className="buyer-dashboard">
      <h1>{t("buyer.title")}</h1>
      <p className="buyer-subtitle">
        {t("buyer.subtitle")}
      </p>

      <div className="buyer-controls">
        <input
          type="text"
          placeholder={t("buyer.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="top-rated">{t("buyer.sortTopRated")}</option>
          <option value="price-low">{t("buyer.sortPriceLow")}</option>
          <option value="price-high">{t("buyer.sortPriceHigh")}</option>
        </select>
      </div>

      <div className="product-grid">
        {displayProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />

            <h3>{product.name}</h3>
            <p className="price">{formatPrice(product.price)}</p>

            <p className="rating">⭐ {(product.rating || 4).toFixed(1)}</p>

            <button
              className="add-btn"
              onClick={() => {
                addToCart(product);
                toast.success(t("buyer.addedToCart"));
              }}
            >
              {t("buyer.addToCart")}
            </button>

            <button
              className="review-btn"
              onClick={() => openReview(product.id)}
            >
              {t("buyer.writeReview")}
            </button>

            <button
              className="custom-btn"
              onClick={() => requestCustomization(product)}
            >
              {t("buyer.askCustomization")}
            </button>
          </div>
        ))}
      </div>

      {displayProducts.length === 0 && (
        <p className="empty-state">{t("buyer.noProducts")}</p>
      )}

      {/* ⭐ REVIEW MODAL */}
      {reviewProductId && (
        <div className="review-modal">
          <div className="review-box">
            <h3>{t("buyer.reviewTitle")}</h3>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value={5}>⭐⭐⭐⭐⭐</option>
              <option value={4}>⭐⭐⭐⭐</option>
              <option value={3}>⭐⭐⭐</option>
              <option value={2}>⭐⭐</option>
              <option value={1}>⭐</option>
            </select>

            <textarea
              placeholder={t("buyer.reviewPlaceholder")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button className="primary-action" onClick={submitReview}>
              {t("buyer.submitReview")}
            </button>
            <button className="ghost-action" onClick={() => setReviewProductId(null)}>
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}

      {/* 🎨 CUSTOMIZATION MODAL */}
      {customProduct && (
        <div className="review-modal">
          <div className="review-box">
            <h3>{t("buyer.customTitle")} — {customProduct.name}</h3>

            <textarea
              placeholder={t("buyer.customPlaceholder")}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
            />

            <button
              className="primary-action"
              onClick={() => {
                if (customMsg.trim().length < 8) {
                  toast.error(t("buyer.customTooShort"));
                  return;
                }

                toast.success(t("buyer.customSent"));
                setCustomProduct(null);
                setCustomMsg("");
              }}
            >
              {t("buyer.sendRequest")}
            </button>

            <button className="ghost-action" onClick={() => setCustomProduct(null)}>
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyerDashboard;