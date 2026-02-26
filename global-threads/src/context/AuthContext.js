import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // persist login
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const login = (username, password) => {
    // default demo users
    const defaultUsers = [
      { username: "admin", password: "admin123", role: "admin" },
      { username: "artisan", password: "artisan123", role: "artisan" },
      { username: "buyer", password: "buyer123", role: "buyer" },
      { username: "marketing", password: "marketing123", role: "marketing" },
    ];

    // get stored users from signup
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // combine demo users + stored users
    const users = [...defaultUsers, ...storedUsers];

    // find matching user
    const foundUser = users.find(
      (u) =>
u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password &&
        u.password === password
    );

    if (foundUser) {
      setUser({ username: foundUser.username, role: foundUser.role });
      return { success: true, role: foundUser.role };
    }

    return { success: false };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}