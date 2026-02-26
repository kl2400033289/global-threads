import "./Home.css";
import { useState } from "react";
import { translations } from "../i18n/translations";
import { Link } from "react-router-dom";

import sareeImg from "../assets/saree.webp";
import kurtaImg from "../assets/kurta.webp";
import dupattaImg from "../assets/dupatta.webp";


function Home() {
  const [lang, setLang] = useState("EN");
  const t = translations[lang];

  return (
    <div className="home-page">
      <div className="language-bar">
        <label htmlFor="lang-select">Language</label>
        <select
          id="lang-select"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="EN">EN</option>
          <option value="HI">हिंदी</option>
          <option value="TE">తెలుగు</option>
        </select>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroDesc}</p>
          <p className="hero-subtext">
            A curated marketplace inspired by royal Indian textiles, handcrafted
            detail, and timeless elegance.
          </p>

          <div className="hero-buttons">
            <Link to="/shop" className="primary-btn">
              {t.shopNow}
            </Link>

            <Link to="/artisan" className="secondary-btn">
              {t.explore}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured">
        <h2>{t.featured}</h2>
        <p className="featured-subtitle">
          Selected pieces blending ancient craft traditions with modern comfort.
        </p>

        <div className="product-grid">
          <div className="product-card">
            <img src={sareeImg} alt="saree" />
            <h3>Handloom Saree</h3>
            <p>₹2,499</p>
          </div>

          <div className="product-card">
            <img src={kurtaImg} alt="kurta" />
            <h3>Cotton Kurta</h3>
            <p>₹1,499</p>
          </div>

          <div className="product-card">
            <img src={dupattaImg} alt="dupatta" />
            <h3>Silk Dupatta</h3>
            <p>₹899</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;