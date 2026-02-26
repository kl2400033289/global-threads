import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const dashboardPath = user ? `/${user.role}` : "/login";

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src="/site-logo.png" alt="Global Threads" className="logo-image" />
        <span>Global Threads</span>
      </Link>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <Link to={dashboardPath}>Dashboard</Link>
        </li>
        {!user && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}
        {user?.role === "buyer" && (
          <li>
            <Link to="/orders">Orders</Link>
          </li>
        )}
      </ul>

      {/* 🌗 Theme Toggle */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <div className="nav-right">
        {/* 🛒 Cart */}
        <Link to="/cart" className="cart-wrapper">
          🛒
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>

        {/* 👤 Logged-in user */}
        {user && (
          <div className="user-box">
            <span className="user-name">
              {user.username} ({user.role})
            </span>

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;