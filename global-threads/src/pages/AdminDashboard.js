import "./AdminDashboard.css";
import { useEffect, useMemo, useState, useContext } from "react";
import { Link } from "react-router-dom";

import { ProductContext } from "../context/ProductContext";
import { OrderContext } from "../context/OrderContext";
import { UserContext } from "../context/UserContext";

function AdminDashboard() {
  const { products, setProducts } = useContext(ProductContext);
  const { orders } = useContext(OrderContext);
  const { users, removeUser, toggleBlockUser } = useContext(UserContext);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
  });

  const [disputeForm, setDisputeForm] = useState({
    orderId: "",
    customer: "",
    issue: "",
    priority: "medium",
  });

  const [disputes, setDisputes] = useState(() => {
    const saved = localStorage.getItem("disputes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("disputes", JSON.stringify(disputes));
  }, [disputes]);

  const buyers = useMemo(
    () => users.filter((entry) => entry.role === "buyer"),
    [users]
  );

  const artisans = useMemo(
    () => users.filter((entry) => entry.role === "artisan"),
    [users]
  );

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + (order.total || 0), 0),
    [orders]
  );

  const avgOrderValue = useMemo(
    () => (orders.length > 0 ? totalRevenue / orders.length : 0),
    [orders.length, totalRevenue]
  );

  const blockedUsersCount = useMemo(
    () => users.filter((entry) => entry.blocked).length,
    [users]
  );

  const highRiskTransactions = useMemo(
    () =>
      orders.filter(
        (order) =>
          Number(order.total) >= 10000 ||
          (order.items?.reduce((count, item) => count + (item.qty || 0), 0) || 0) >= 6
      ),
    [orders]
  );

  const pendingDisputes = useMemo(
    () => disputes.filter((item) => item.status !== "resolved" && item.status !== "closed"),
    [disputes]
  );

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const addProduct = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: form.name,
      price: Number(form.price),
      image: form.image || "https://via.placeholder.com/300x300?text=Product",
      rating: 0,
      reviews: [],
    };

    setProducts((prev) => [...prev, newProduct]);
    setForm({ name: "", price: "", image: "" });
    setPreview("");
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const handleDisputeField = (e) => {
    setDisputeForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const createDispute = (e) => {
    e.preventDefault();

    if (!disputeForm.orderId.trim() || !disputeForm.customer.trim() || !disputeForm.issue.trim()) {
      return;
    }

    const newDispute = {
      id: Date.now(),
      orderId: disputeForm.orderId.trim(),
      customer: disputeForm.customer.trim(),
      issue: disputeForm.issue.trim(),
      priority: disputeForm.priority,
      status: "open",
      createdAt: new Date().toLocaleString(),
    };

    setDisputes((prev) => [newDispute, ...prev]);
    setDisputeForm({
      orderId: "",
      customer: "",
      issue: "",
      priority: "medium",
    });
  };

  const updateDisputeStatus = (id, status) => {
    setDisputes((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, status } : entry))
    );
  };

  const clearClosedDisputes = () => {
    setDisputes((prev) => prev.filter((entry) => entry.status !== "closed"));
  };

  const forceLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    alert("Active session cleared. User needs to log in again.");
  };

  const clearCartCache = () => {
    localStorage.removeItem("cart");
    alert("Cart cache cleared.");
  };

  return (
    <div className="admin-layout admin-light">
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
            className={activeTab === "accounts" ? "active" : ""}
            onClick={() => setActiveTab("accounts")}
          >
            👥 User Accounts
          </li>

          <li
            className={activeTab === "transactions" ? "active" : ""}
            onClick={() => setActiveTab("transactions")}
          >
            🧾 Transactions
          </li>

          <li
            className={activeTab === "security" ? "active" : ""}
            onClick={() => setActiveTab("security")}
          >
            🔐 Security
          </li>

          <li
            className={activeTab === "disputes" ? "active" : ""}
            onClick={() => setActiveTab("disputes")}
          >
            ⚖️ Disputes
          </li>
        </ul>

        <Link to="/" className="back-home">
          ⬅ Back to Site
        </Link>
      </aside>

      <main className="admin-main">
        {activeTab === "dashboard" && (
          <>
            <h1 className="admin-title">Admin Dashboard</h1>

            <div className="admin-stats">
              <div className="stat-card">
                <h3>{users.length}</h3>
                <p>Total Accounts</p>
              </div>

              <div className="stat-card">
                <h3>{buyers.length}</h3>
                <p>Buyer Accounts</p>
              </div>

              <div className="stat-card">
                <h3>{artisans.length}</h3>
                <p>Artisan Accounts</p>
              </div>

              <div className="stat-card">
                <h3>{orders.length}</h3>
                <p>Total Transactions</p>
              </div>

              <div className="stat-card">
                <h3>₹{totalRevenue}</h3>
                <p>Revenue</p>
              </div>

              <div className="stat-card">
                <h3>{pendingDisputes.length}</h3>
                <p>Open Disputes</p>
              </div>
            </div>
          </>
        )}

        {activeTab === "products" && (
          <>
            <h1 className="admin-title">Product Management</h1>

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

                <input type="file" accept="image/*" onChange={handleImageUpload} />

                {preview && <img src={preview} alt="preview" className="image-preview" />}

                <button type="submit">➕ Add Product</button>
              </form>
            </div>

            <div className="admin-table">
              <h2>All Products</h2>

              <table>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>₹{product.price}</td>
                      <td>
                        <button className="delete-btn" onClick={() => deleteProduct(product.id)}>
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

        {activeTab === "accounts" && (
          <div>
            <h1 className="admin-title">Manage User Accounts</h1>

            <div className="accounts-columns">
              <section className="admin-table">
                <h2>Artisan Accounts ({artisans.length})</h2>
                {artisans.length === 0 ? (
                  <p className="empty-text">No artisan accounts found.</p>
                ) : (
                  <div className="users-grid">
                    {artisans.map((account) => (
                      <div key={account.id} className="user-card">
                        <h3>👤 {account.username}</h3>
                        <p>
                          <strong>Role:</strong> artisan
                        </p>
                        <p>
                          <strong>Status:</strong> {account.blocked ? "🚫 Blocked" : "✅ Active"}
                        </p>
                        <div className="user-actions">
                          <button className="block-btn" onClick={() => toggleBlockUser(account.id)}>
                            {account.blocked ? "Unblock" : "Block"}
                          </button>
                          <button className="delete-btn" onClick={() => removeUser(account.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="admin-table">
                <h2>Buyer Accounts ({buyers.length})</h2>
                {buyers.length === 0 ? (
                  <p className="empty-text">No buyer accounts found.</p>
                ) : (
                  <div className="users-grid">
                    {buyers.map((account) => (
                      <div key={account.id} className="user-card">
                        <h3>👤 {account.username}</h3>
                        <p>
                          <strong>Role:</strong> buyer
                        </p>
                        <p>
                          <strong>Status:</strong> {account.blocked ? "🚫 Blocked" : "✅ Active"}
                        </p>
                        <div className="user-actions">
                          <button className="block-btn" onClick={() => toggleBlockUser(account.id)}>
                            {account.blocked ? "Unblock" : "Block"}
                          </button>
                          <button className="delete-btn" onClick={() => removeUser(account.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div>
            <h1 className="admin-title">Monitor Transactions</h1>

            <div className="admin-stats">
              <div className="stat-card">
                <h3>{orders.length}</h3>
                <p>Total Transactions</p>
              </div>
              <div className="stat-card">
                <h3>₹{totalRevenue}</h3>
                <p>Total Revenue</p>
              </div>
              <div className="stat-card">
                <h3>₹{Math.round(avgOrderValue)}</h3>
                <p>Average Transaction</p>
              </div>
              <div className="stat-card">
                <h3>{highRiskTransactions.length}</h3>
                <p>High-Risk Flagged</p>
              </div>
            </div>

            <div className="admin-table" style={{ marginTop: "18px" }}>
              <h2>Recent Transactions</h2>
              {orders.length === 0 ? (
                <p className="empty-text">No transactions yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const qty =
                        order.items?.reduce((count, item) => count + (item.qty || 0), 0) || 0;
                      const highRisk = Number(order.total) >= 10000 || qty >= 6;

                      return (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.username}</td>
                          <td>{order.date || "-"}</td>
                          <td>{qty}</td>
                          <td>₹{order.total}</td>
                          <td>
                            <span className={highRisk ? "badge danger" : "badge success"}>
                              {highRisk ? "Review" : "Normal"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <h1 className="admin-title">Maintain Platform Security</h1>

            <div className="admin-stats">
              <div className="stat-card">
                <h3>{blockedUsersCount}</h3>
                <p>Blocked Accounts</p>
              </div>
              <div className="stat-card">
                <h3>{highRiskTransactions.length}</h3>
                <p>Transactions to Review</p>
              </div>
              <div className="stat-card">
                <h3>{localStorage.getItem("user") ? "Active" : "None"}</h3>
                <p>Current Session</p>
              </div>
            </div>

            <div className="security-actions">
              <button className="block-btn" onClick={forceLogout}>
                Force Logout Current Session
              </button>
              <button className="block-btn" onClick={clearCartCache}>
                Clear Cart Cache
              </button>
              <button className="delete-btn" onClick={clearClosedDisputes}>
                Clean Closed Disputes
              </button>
            </div>

            <div className="admin-table" style={{ marginTop: "16px" }}>
              <h2>Flagged Transaction Review Queue</h2>
              {highRiskTransactions.length === 0 ? (
                <p className="empty-text">No high-risk transactions detected.</p>
              ) : (
                highRiskTransactions.map((order) => (
                  <div key={order.id} className="security-row">
                    <div>
                      <strong>Order #{order.id}</strong>
                      <p>
                        User: {order.username} • Total: ₹{order.total}
                      </p>
                    </div>
                    <span className="badge danger">Needs Review</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "disputes" && (
          <div>
            <h1 className="admin-title">Handle Dispute Resolution</h1>

            <div className="admin-form-card">
              <h2>Create Dispute Case</h2>
              <form className="admin-form" onSubmit={createDispute}>
                <input
                  type="text"
                  name="orderId"
                  placeholder="Order ID"
                  value={disputeForm.orderId}
                  onChange={handleDisputeField}
                />
                <input
                  type="text"
                  name="customer"
                  placeholder="Customer username"
                  value={disputeForm.customer}
                  onChange={handleDisputeField}
                />
                <input
                  type="text"
                  name="issue"
                  placeholder="Issue summary"
                  value={disputeForm.issue}
                  onChange={handleDisputeField}
                />
                <select
                  name="priority"
                  value={disputeForm.priority}
                  onChange={handleDisputeField}
                  className="admin-select"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <button type="submit">Create Case</button>
              </form>
            </div>

            <div className="admin-table">
              <h2>Dispute Queue ({pendingDisputes.length} open)</h2>

              {disputes.length === 0 ? (
                <p className="empty-text">No disputes created yet.</p>
              ) : (
                disputes.map((entry) => (
                  <div key={entry.id} className="dispute-card">
                    <div className="dispute-head">
                      <strong>
                        Order #{entry.orderId} • {entry.customer}
                      </strong>
                      <span className={`badge ${entry.status === "resolved" ? "success" : "danger"}`}>
                        {entry.status}
                      </span>
                    </div>
                    <p>{entry.issue}</p>
                    <p>
                      Priority: <strong>{entry.priority}</strong> • Created: {entry.createdAt}
                    </p>
                    <div className="user-actions">
                      <button className="block-btn" onClick={() => updateDisputeStatus(entry.id, "in-review")}>
                        In Review
                      </button>
                      <button className="block-btn" onClick={() => updateDisputeStatus(entry.id, "resolved")}>
                        Resolve
                      </button>
                      <button className="delete-btn" onClick={() => updateDisputeStatus(entry.id, "closed")}>
                        Close
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
