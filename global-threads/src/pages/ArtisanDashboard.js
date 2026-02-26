import { useContext, useMemo, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { OrderContext } from "../context/OrderContext";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import "./ArtisanDashboard.css";

const defaultImage = "https://via.placeholder.com/300x300?text=Product";

const emptyForm = {
  name: "",
  price: "",
  costPrice: "",
  stock: "",
  designNotes: "",
  image: "",
};

function ArtisanDashboard() {
  const { products, setProducts } = useContext(ProductContext);
  const { orders } = useContext(OrderContext);
  const { user } = useContext(AuthContext);
  const { lang, setLang, t, languages } = useLanguage();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const currentArtisan = user?.username?.trim().toLowerCase();

  const artisanProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (product.artisan || "artisan").trim().toLowerCase() ===
          currentArtisan
      ),
    [products, currentArtisan]
  );

  const analytics = useMemo(() => {
    const artisanIds = new Set(artisanProducts.map((product) => product.id));
    const soldByProduct = {};
    const customers = new Set();
    let soldUnits = 0;
    let revenue = 0;
    let cost = 0;

    orders.forEach((order) => {
      let purchasedFromArtisan = false;

      order.items.forEach((item) => {
        if (!artisanIds.has(item.id)) {
          return;
        }

        const qty = Number(item.qty) || 1;
        const lineRevenue = (Number(item.price) || 0) * qty;
        const sourceProduct = artisanProducts.find(
          (product) => product.id === item.id
        );
        const unitCost = Number(sourceProduct?.costPrice) || 0;

        soldByProduct[item.id] = (soldByProduct[item.id] || 0) + qty;
        soldUnits += qty;
        revenue += lineRevenue;
        cost += unitCost * qty;
        purchasedFromArtisan = true;
      });

      if (purchasedFromArtisan && order.username) {
        customers.add(order.username);
      }
    });

    return {
      soldByProduct,
      soldUnits,
      revenue,
      customersCount: customers.size,
      profitLoss: revenue - cost,
    };
  }, [orders, artisanProducts]);

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const handleFieldChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price || !form.stock) {
      return;
    }

    if (editingId) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingId
            ? {
                ...product,
                name: form.name.trim(),
                price: Number(form.price) || 0,
                costPrice: Number(form.costPrice) || 0,
                stock: Math.max(0, Number(form.stock) || 0),
                designNotes: form.designNotes.trim(),
                image: form.image || product.image,
              }
            : product
        )
      );

      resetForm();
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: form.name.trim(),
      price: Number(form.price) || 0,
      costPrice: Number(form.costPrice) || 0,
      stock: Math.max(0, Number(form.stock) || 0),
      designNotes: form.designNotes.trim(),
      image: form.image || defaultImage,
      rating: 0,
      reviews: [],
      artisan: user?.username || "artisan",
    };

    setProducts((prev) => [newProduct, ...prev]);
    resetForm();
  };

  const handleEditProduct = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      price: String(product.price ?? ""),
      costPrice: String(product.costPrice ?? ""),
      stock: String(product.stock ?? 0),
      designNotes: product.designNotes || "",
      image: product.image || "",
    });
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <div className="artisan-page">
      <div className="artisan-header-row">
        <div>
          <h1>{t.artisanTitle}</h1>
          <p>{t.artisanSubtitle}</p>
        </div>

        <div className="artisan-language">
          <label htmlFor="artisan-lang">{t("common.language", "Language")}</label>
          <select
            id="artisan-lang"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            {languages.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="artisan-stats">
        <div className="artisan-stat-card">
          <h3>{artisanProducts.length}</h3>
          <p>{t.productsCount}</p>
        </div>
        <div className="artisan-stat-card">
          <h3>{analytics.soldUnits}</h3>
          <p>{t.soldUnits}</p>
        </div>
        <div className="artisan-stat-card">
          <h3>{analytics.customersCount}</h3>
          <p>{t.customersCount}</p>
        </div>
        <div className="artisan-stat-card">
          <h3>{formatMoney(analytics.revenue)}</h3>
          <p>{t.revenue}</p>
        </div>
        <div className="artisan-stat-card">
          <h3
            className={
              analytics.profitLoss >= 0
                ? "artisan-value-positive"
                : "artisan-value-negative"
            }
          >
            {formatMoney(analytics.profitLoss)}
          </h3>
          <p>{t.profitLoss}</p>
        </div>
      </div>

      <div className="artisan-grid">
        <div className="artisan-form-card">
          <h2>{t.uploadProduct}</h2>

          <form className="artisan-form" onSubmit={handleSaveProduct}>
            <label htmlFor="name">{t.productName}</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleFieldChange}
              required
            />

            <label htmlFor="price">{t.productPrice}</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleFieldChange}
              required
            />

            <label htmlFor="costPrice">{t.productCost}</label>
            <input
              id="costPrice"
              name="costPrice"
              type="number"
              min="0"
              value={form.costPrice}
              onChange={handleFieldChange}
            />

            <label htmlFor="stock">{t.productStock}</label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleFieldChange}
              required
            />

            <label htmlFor="designNotes">{t.productDesign}</label>
            <textarea
              id="designNotes"
              name="designNotes"
              rows="3"
              value={form.designNotes}
              onChange={handleFieldChange}
            />

            <label htmlFor="image">{t.productImage}</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />

            {form.image && (
              <img src={form.image} alt="preview" className="artisan-preview" />
            )}

            <div className="artisan-form-actions">
              <button type="submit" className="artisan-primary-btn">
                {editingId ? t.update : t.saveProduct}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="artisan-secondary-btn"
                  onClick={resetForm}
                >
                  {t.cancel}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="artisan-products-card">
          <h2>{t.yourProducts}</h2>

          {artisanProducts.length === 0 ? (
            <p className="artisan-empty">{t.noProducts}</p>
          ) : (
            <div className="artisan-product-list">
              {artisanProducts.map((product) => (
                <div key={product.id} className="artisan-product-item">
                  <img
                    src={product.image || defaultImage}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />

                  <div className="artisan-product-info">
                    <h3>{product.name}</h3>
                    <p>
                      {t.productPrice}: {formatMoney(product.price)}
                    </p>
                    <p>
                      {t.productStock}: {Number(product.stock) || 0}
                    </p>
                    <p>
                      {t.productCost}: {formatMoney(product.costPrice || 0)}
                    </p>
                    <p>
                      {t.soldByProduct}: {analytics.soldByProduct[product.id] || 0}
                    </p>
                    {product.designNotes && <p>{product.designNotes}</p>}
                  </div>

                  <div className="artisan-product-actions">
                    <button
                      className="artisan-secondary-btn"
                      type="button"
                      onClick={() => handleEditProduct(product)}
                    >
                      {t.edit}
                    </button>
                    <button
                      className="artisan-danger-btn"
                      type="button"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      {t.delete}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtisanDashboard;