import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import itTranslation from "./locales/it/translation.json";

const isBrowser = typeof window !== "undefined";

const initialLng =
  isBrowser && document.documentElement.lang === "it" ? "it" : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    it: { translation: itTranslation },
  },
  lng: initialLng,
  fallbackLng: "en",
  supportedLngs: ["en", "it"],
  debug: false,
  interpolation: {
    escapeValue: false, // React already protects from XSS
  },
});

if (isBrowser) {
  i18n.on("languageChanged", (lng) => {
    document.documentElement.lang = lng;
  });
}

export default i18n;
