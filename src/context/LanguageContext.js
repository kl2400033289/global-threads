import { createContext, useContext, useMemo, useState } from "react";
import { translations } from "../i18n/translations";

export const LanguageContext = createContext();

const defaultLanguage = "EN";

const readStoredLanguage = () => {
  const stored = localStorage.getItem("language");
  if (stored && translations[stored]) {
    return stored;
  }
  return defaultLanguage;
};

const getNestedValue = (source, path) =>
  path
    .split(".")
    .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), source);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLanguage);

  const setLang = (nextLang) => {
    const resolved = translations[nextLang] ? nextLang : defaultLanguage;
    setLangState(resolved);
    localStorage.setItem("language", resolved);
  };

  const t = (key, fallback = "") => {
    const currentValue = getNestedValue(translations[lang], key);
    if (currentValue !== undefined) {
      return currentValue;
    }

    const englishValue = getNestedValue(translations.EN, key);
    if (englishValue !== undefined) {
      return englishValue;
    }

    return fallback || key;
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
      languages: [
        { code: "EN", label: "EN" },
        { code: "HI", label: "हिंदी" },
        { code: "TE", label: "తెలుగు" },
        { code: "OR", label: "ଓଡ଼ିଆ" },
      ],
    }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);