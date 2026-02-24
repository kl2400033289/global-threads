import "./AdminDashboard.css";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";

function AdminDashboard() {
  // ✅ global products
  const { products, setProducts } = useContext(ProductContext);

  // ✅ active sidebar tab
  const [activeTab, setActiveTab] = useState("dashboard");

  // ✅ form state
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
  });

  const [preview, setPreview] = useState("");

  // ===============================
  // 🔹 HANDLE INPUT
  // ===============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===============================
  // 🔹 IMAGE UPLOAD
  // ===============================
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // ===============================
  // 🔹 ADD PRODUCT
  // ===============================
  const addProduct = (e) => {
    e.preventDefault();

    if (!form.name || !form.price) return;

    const newProduct = {
      id: Date.now(),
      name: form.name,
      price: Number(form.price),
      image: form.image || "/assets/placeholder.png",
    };

    setProducts([...products, newProduct]);

    setForm({ name: "", price: "", image: "" });
    setPreview("");
  };

  // ===============================
  // 🔹 DELETE PRODUCT
  // ===============================
  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
 <div className="admin-layout">
  <div className="admin-layout admin-light"></div>
      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <h2 className="sidebar-logo">🌍 Admin</h2>

        <ul className="sidebar-menu">
          <li
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </li>

          <li
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            📦 Products
          </li>

          <li
            className={activeTab === "artisans" ? "active" : ""}
            onClick={() => setActiveTab("artisans")}
          >
            🧵 Artisans
          </li>

          <li
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            🛒 Orders
          </li>

          <li
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            👥 Users
          </li>

          <li
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Settings
          </li>
        </ul>

        <Link to="/" className="back-home">
          ⬅ Back to Site
        </Link>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="admin-main">

        {/* ================= DASHBOARD ================= */}
        {activeTab === "dashboard" && (
          <>
            <h1 className="admin-title">Admin Dashboard</h1>

            <div className="admin-stats">
              <div className="stat-card">
                <h3>{products.length}</h3>
                <p>Total Products</p>
              </div>

              <div className="stat-card">
                <h3>₹0</h3>
                <p>Total Revenue</p>
              </div>

              <div className="stat-card">
                <h3>0</h3>
                <p>Total Orders</p>
              </div>
            </div>
          </>
        )}

        {/* ================= PRODUCTS ================= */}
        {activeTab === "products" && (
          <>
            <h1 className="admin-title">Product Management</h1>

            {/* ===== ADD PRODUCT ===== */}
            <div className="admin-form-card">
              <h2>Add New Product</h2>

              <form onSubmit={addProduct} className="admin-form">
                <input
                  type="text"
                  name="name"
                  placeholder="Product name"
                  value={form.name}
                  onChange={handleChange}
                />

                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                />

                {/* ✅ FILE PICKER */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />

                {/* ✅ IMAGE PREVIEW */}
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="image-preview"
                  />
                )}

                <button type="submit">➕ Add Product</button>
              </form>
            </div>

            {/* ===== PRODUCT TABLE ===== */}
            <div className="admin-table">
              <h2>All Products</h2>

              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{
                            width: "50px",
                            borderRadius: "6px",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>{p.name}</td>
                      <td>₹{p.price}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => deleteProduct(p.id)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ================= ARTISANS ================= */}
        {activeTab === "artisans" && (
          <div>
            <h1 className="admin-title">Artisans</h1>
            <p className="empty-text">No artisans added yet.</p>
          </div>
        )}

        {/* ================= ORDERS ================= */}
        {activeTab === "orders" && (
          <div>
            <h1 className="admin-title">Orders</h1>
            <p className="empty-text">Order management coming soon.</p>
          </div>
        )}

        {/* ================= USERS ================= */}
        {activeTab === "users" && (
          <div>
            <h1 className="admin-title">Users</h1>
            <p className="empty-text">User management coming soon.</p>
          </div>
        )}

        {/* ================= SETTINGS ================= */}
        {activeTab === "settings" && (
          <div>
            <h1 className="admin-title">Settings</h1>
            <p className="empty-text">Admin settings panel.</p>
          </div>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;