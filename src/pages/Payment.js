import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { OrderContext } from "../context/OrderContext";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();

  const { cart, clearCart } = useContext(CartContext);
  const { addOrder } = useContext(OrderContext);
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handlePayment = () => {
    setLoading(true);

    // ⏳ fake delay
    setTimeout(() => {
      const newOrder = {
        id: Date.now(),
        username: user?.username || "guest", // ⭐ important
        items: cart,
        total,
        date: new Date().toLocaleString(),
      };

      addOrder(newOrder);
      clearCart();

      alert(`✅ ${t("payment.success")}`);
      navigate("/");
    }, 2000);
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h1>💳 {t("payment.title")}</h1>

        <div className="payment-summary">
          <h3>{t("payment.totalAmount")}</h3>
          <h2>₹{total}</h2>
        </div>

        <button
          className="pay-btn"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? t("payment.processing") : t("payment.payNow")}
        </button>
      </div>
    </div>
  );
}

export default Payment;