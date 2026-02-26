import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { t } = useLanguage();
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
      setError(t("login.invalidCreds"));
      return;
    }

    // redirect based on role
    navigate(`/${result.role}`);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-badge">{t("login.welcomeBack")}</p>
        <h1 className="auth-title">{t("login.title")}</h1>
        <p className="auth-subtitle">
          {t("login.subtitle")}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="username">{t("login.username")}</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder={t("login.enterUsername")}
            value={form.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">{t("login.password")}</label>
          <div className="password-row">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("login.enterPassword")}
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? t("login.hide") : t("login.show")}
            </button>
          </div>

          {error && <p className="auth-message error-text">{error}</p>}

          <button type="submit" className="primary-btn auth-submit">
            {t("login.submit")}
          </button>
        </form>

        <p className="switch-auth-text">
          {t("login.noAccount")}
          <span onClick={() => navigate("/signup")}> {t("login.signUp")}</span>
        </p>

        <p className="switch-auth-text auth-link-secondary">
          <span onClick={() => navigate("/forgot-password")}>{t("login.forgotPassword")}</span>
        </p>

        <div className="demo-panel">
          <p className="demo-title">{t("login.quickDemo")}</p>
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