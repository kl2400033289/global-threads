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

  const demoUsers = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "artisan", password: "artisan123", role: "artisan" },
    { username: "buyer", password: "buyer123", role: "buyer" },
    { username: "marketing", password: "marketing123", role: "marketing" },
  ];

  // check demo users
  let foundUser = demoUsers.find(
    (u) => u.username === username && u.password === password
  );

  // check signup users
  if (!foundUser) {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    foundUser = storedUsers.find(
      (u) => u.username === username && u.password === password
    );
  }

  // if not found
  if (!foundUser) {
    return { success: false };
  }

  // ⭐⭐⭐ THIS WAS MISSING ⭐⭐⭐
  setUser(foundUser);   // <-- IMPORTANT

  localStorage.setItem("user", JSON.stringify(foundUser));

  return { success: true, role: foundUser.role };
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