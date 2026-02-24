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

  // 🔹 login
 const login = (username, password) => {
  const users = {
    admin: { password: "admin123", role: "admin" },
    artisan: { password: "artisan123", role: "artisan" },
    buyer: { password: "buyer123", role: "buyer" },
    marketing: { password: "marketing123", role: "marketing" },
  };

  const user = users[username.toLowerCase()];

  if (user && user.password === password) {
    setUser({ role: user.role, username });
    return { success: true, role: user.role };
  }

  return { success: false };
};

  // 🔹 logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}