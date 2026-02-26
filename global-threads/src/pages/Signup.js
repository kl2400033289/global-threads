import "./Login.css";   // reuse SAME CSS
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "buyer",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setMessage({ text: "", type: "" });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.username.trim().length < 3) {
      setMessage({ text: "Username must be at least 3 characters", type: "error" });
      return;
    }

    if (form.password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters", type: "error" });
      return;
    }

    if (form.password !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    // get existing users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // check if already exists
    const exists = users.find(
      (u) =>
        u.username.trim().toLowerCase() === form.username.trim().toLowerCase()
    );

    if (exists) {
      setMessage({ text: "User already exists", type: "error" });
      return;
    }

    // save user
    users.push({
      username: form.username.trim(),
      password: form.password,
      role: form.role,
    });

    localStorage.setItem("users", JSON.stringify(users));

    setMessage({ text: "Account created successfully! Redirecting...", type: "success" });

    // redirect to login after signup
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-badge">Create Account</p>
        <h1 className="auth-title">Join Global Threads</h1>
        <p className="auth-subtitle">
          Build your profile to buy, sell, and grow with heritage fashion.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="signup-username">Username</label>
          <input
            id="signup-username"
            type="text"
            name="username"
            placeholder="Choose username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="signup-role">Role</label>
          <select
            id="signup-role"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="buyer">Buyer</option>
            <option value="artisan">Artisan</option>
            <option value="marketing">Marketing</option>
          </select>

          <label htmlFor="signup-password">Password</label>
          <div className="password-row">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create password"
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

          <label htmlFor="signup-confirm-password">Confirm Password</label>
          <input
            id="signup-confirm-password"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => {
              setMessage({ text: "", type: "" });
              setConfirmPassword(e.target.value);
            }}
            required
          />

          {message.text && (
            <p
              className={`auth-message ${
                message.type === "success" ? "success-text" : "error-text"
              }`}
            >
              {message.text}
            </p>
          )}

          <button type="submit" className="primary-btn auth-submit">
            Create Account
          </button>
        </form>

        <p className="switch-auth-text">
          Already have an account?
          <span onClick={() => navigate("/login")}> Login</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;