import { useLanguage } from "../context/LanguageContext";

function ProductDetail() {
  const { t } = useLanguage();

  return (
    <div style={{ padding: "40px" }}>
      <h1>{t("productDetail.title", "Product Detail")}</h1>
    </div>
  );
}
export default ProductDetail;