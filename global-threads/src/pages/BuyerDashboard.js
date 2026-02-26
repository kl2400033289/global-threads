import { useContext, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { CartContext } from "../context/CartContext";
import toast from "react-hot-toast";
import "./BuyerDashboard.css";

function BuyerDashboard() {
  const { products, setProducts } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);

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
      toast.error("Please add a slightly longer review");
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
    toast.success("Thank you! Your review has been added.");
  };

  // 🎨 customization
  const requestCustomization = (product) => {
    setCustomProduct(product);
  };

  return (
    <div className="buyer-dashboard">
      <h1>🛍 Buyer Dashboard</h1>
      <p className="buyer-subtitle">
        Browse premium artisan pieces, manage customization, and leave trusted
        buyer reviews.
      </p>

      <div className="buyer-controls">
        <input
          type="text"
          placeholder="Search handcrafted products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="top-rated">Sort: Top Rated</option>
          <option value="price-low">Sort: Price Low to High</option>
          <option value="price-high">Sort: Price High to Low</option>
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
                toast.success("Added to cart");
              }}
            >
              🛒 Add to Cart
            </button>

            <button
              className="review-btn"
              onClick={() => openReview(product.id)}
            >
              ✍️ Write Review
            </button>

            <button
              className="custom-btn"
              onClick={() => requestCustomization(product)}
            >
              🎨 Ask for Customization
            </button>
          </div>
        ))}
      </div>

      {displayProducts.length === 0 && (
        <p className="empty-state">No products match your search.</p>
      )}

      {/* ⭐ REVIEW MODAL */}
      {reviewProductId && (
        <div className="review-modal">
          <div className="review-box">
            <h3>Write Review</h3>
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
              placeholder="Share your experience with quality, fit, and finish"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button className="primary-action" onClick={submitReview}>
              Submit Review
            </button>
            <button className="ghost-action" onClick={() => setReviewProductId(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 🎨 CUSTOMIZATION MODAL */}
      {customProduct && (
        <div className="review-modal">
          <div className="review-box">
            <h3>Customization Request — {customProduct.name}</h3>

            <textarea
              placeholder="Tell the artisan your preferred color, fabric details, fit, and timeline"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
            />

            <button
              className="primary-action"
              onClick={() => {
                if (customMsg.trim().length < 8) {
                  toast.error("Please add a bit more detail for the artisan");
                  return;
                }

                toast.success("Customization request sent to artisan");
                setCustomProduct(null);
                setCustomMsg("");
              }}
            >
              Send Request
            </button>

            <button className="ghost-action" onClick={() => setCustomProduct(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyerDashboard;