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
    const demoUsers = {
      admin: { password: "admin123", role: "admin" },
      artisan: { password: "artisan123", role: "artisan" },
      buyer: { password: "buyer123", role: "buyer" },
      marketing: { password: "marketing123", role: "marketing" },
    };

    const normalizedUsername = username.trim().toLowerCase();

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const customUser = storedUsers.find(
      (entry) => entry.username.trim().toLowerCase() === normalizedUsername
    );

    if (customUser && customUser.password === password) {
      setUser({ role: customUser.role, username: customUser.username });
      return { success: true, role: customUser.role };
    }

    const foundDemoUser = demoUsers[normalizedUsername];

    if (foundDemoUser && foundDemoUser.password === password) {
      setUser({ role: foundDemoUser.role, username });
      return { success: true, role: foundDemoUser.role };
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