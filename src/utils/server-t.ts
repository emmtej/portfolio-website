import en from "../locales/en/translation.json";
import it from "../locales/it/translation.json";
import { resolveTranslationKey } from "./resolve-translation-key";

const resources = { en, it } as const;
export type Locale = keyof typeof resources;

type TranslateOptions = {
  returnObjects?: boolean;
};

export function resolveLocale(
  currentLocale: string | undefined,
  pathname: string,
): Locale {
  if (currentLocale === "it") return "it";
  if (pathname.startsWith("/it")) return "it";
  return "en";
}

export function getServerT(locale: string | undefined) {
  const lang: Locale = locale === "it" ? "it" : "en";
  return (key: string, options?: TranslateOptions): string | unknown => {
    const value = resolveTranslationKey(resources[lang], key);
    if (options?.returnObjects) return value;
    if (typeof value === "string") return value;
    return key;
  };
}
