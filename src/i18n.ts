import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./locales/en/translation.json";
import itTranslation from "./locales/it/translation.json";

const isBrowser = typeof window !== "undefined";

const i18nInstance = i18n;

if (isBrowser) {
  i18nInstance.use(LanguageDetector);
}

i18nInstance
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      it: { translation: itTranslation },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "it"],
    debug: false,
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
    ...(isBrowser ? {
      detection: {
        order: ["htmlTag", "querystring", "navigator"],
        caches: [],
      },
    } : {
      lng: "en", // Default for SSR
    }),
  });

if (isBrowser) {
  i18nInstance.on("languageChanged", (lng) => {
    document.documentElement.lang = lng;
  });
}

export default i18nInstance;
