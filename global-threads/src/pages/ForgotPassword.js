import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // reuse same styles

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: username, 2: OTP, 3: new password
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [strength, setStrength] = useState("");

  // Step 1: Check username exists
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const defaultUsers = [
      { username: "admin", password: "admin123", role: "admin" },
      { username: "artisan", password: "artisan123", role: "artisan" },
      { username: "buyer", password: "buyer123", role: "buyer" },
      { username: "marketing", password: "marketing123", role: "marketing" },
    ];
    const allUsers = [...defaultUsers, ...users];

    const userExists = allUsers.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (!userExists) {
      setMessage("Username not found");
      return;
    }

    // generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);
    setStep(2);
    setMessage(`Your OTP is: ${otpCode} (for demo purposes)`); // in real apps, send via email
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      setMessage("Invalid OTP");
      return;
    }
    setStep(3);
    setMessage("");
  };

  // Password strength check
  const checkStrength = (pwd) => {
    if (pwd.length < 4) return "Weak";
    if (pwd.match(/[a-z]/) && pwd.match(/[0-9]/)) return "Medium";
    if (pwd.match(/[a-z]/) && pwd.match(/[0-9]/) && pwd.match(/[!@#$%^&*]/))
      return "Strong";
    return "Weak";
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setStrength(checkStrength(e.target.value));
  };

  // Step 3: Update password
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (index !== -1) {
      users[index].password = newPassword;
      localStorage.setItem("users", JSON.stringify(users));
    } else {
      // check demo users (optional: allow changing demo passwords for testing)
      setMessage(
        "Cannot change password for demo users. Use a signup account."
      );
      return;
    }

    setMessage("Password updated successfully!");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="role-container">
      <h1 className="role-title">Forgot Password</h1>

      {step === 1 && (
        <form className="login-form" onSubmit={handleUsernameSubmit}>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {message && <p className="error-text">{message}</p>}
          <button type="submit" className="primary-btn">
            Next
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="login-form" onSubmit={handleOtpSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          {message && <p className="error-text">{message}</p>}
          <button type="submit" className="primary-btn">
            Verify OTP
          </button>
        </form>
      )}

      {step === 3 && (
        <form className="login-form" onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={handlePasswordChange}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {strength && <p>Password Strength: {strength}</p>}
          {message && <p className="error-text">{message}</p>}
          <button type="submit" className="primary-btn">
            Reset Password
          </button>
        </form>
      )}

      <p style={{ marginTop: "20px" }}>
        Remembered your password?{" "}
        <span
          style={{ color: "#8b1e2d", cursor: "pointer", fontWeight: "600" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default ForgotPassword;