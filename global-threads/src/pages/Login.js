import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const demoAccounts = [
    { username: "admin", password: "admin123", role: "Admin" },
    { username: "artisan", password: "artisan123", role: "Artisan" },
    { username: "buyer", password: "buyer123", role: "Buyer" },
    {
      username: "marketing",
      password: "marketing123",
      role: "Marketing",
    },
  ];

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fillDemoAccount = ({ username, password }) => {
    setForm({ username, password });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = login(form.username.trim(), form.password);

    if (!result.success) {
      setError("Invalid credentials. Please check username and password.");
      return;
    }

    // redirect based on role
    navigate(`/${result.role}`);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-badge">Welcome Back</p>
        <h1 className="auth-title">Login to Global Threads</h1>
        <p className="auth-subtitle">
          Access your curated textile marketplace dashboard.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Enter username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-row">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <p className="auth-message error-text">{error}</p>}

          <button type="submit" className="primary-btn auth-submit">
            Login
          </button>
        </form>

        <p className="switch-auth-text">
          Don’t have an account?
          <span onClick={() => navigate("/signup")}> Sign Up</span>
        </p>

        <p className="switch-auth-text auth-link-secondary">
          <span onClick={() => navigate("/forgot-password")}>Forgot Password?</span>
        </p>

        <div className="demo-panel">
          <p className="demo-title">Quick Demo Access</p>
          <div className="demo-grid">
            {demoAccounts.map((account) => (
              <button
                key={account.username}
                type="button"
                className="demo-chip"
                onClick={() => fillDemoAccount(account)}
              >
                {account.role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;