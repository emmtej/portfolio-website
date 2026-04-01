import { useTranslation } from "react-i18next";
import { cn } from "../utils/cn";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith("en") ? "it" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 hover:bg-border-subtle transition-colors duration-200 text-xs font-bold uppercase tracking-widest text-text-main flex items-center gap-2"
      aria-label={t("nav.toggle_language", { defaultValue: "Toggle language" })}
    >
      <span className={cn(i18n.language.startsWith("en") ? "text-text-main" : "text-text-muted")}>
        EN
      </span>
      <span className="text-border-subtle">/</span>
      <span className={cn(i18n.language.startsWith("it") ? "text-text-main" : "text-text-muted")}>
        IT
      </span>
    </button>
  );
}
