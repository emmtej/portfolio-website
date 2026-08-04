import { vi } from "vitest";
import type React from "react";
import type * as i18next from "react-i18next";
import "@testing-library/react"; // Just making sure imports exist

// Mock scrollIntoView since it's not implemented in the test environment
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// We must mock react-i18next so that we don't trigger React Suspense during tests 
// because HttpBackend requires asynchronous network fetching which is unavailable/mocked.
import enTranslations from "../locales/en/translation.json";
import { resolveTranslationKey } from "../utils/resolve-translation-key";

vi.mock("react-i18next", async () => {
  const actual = await vi.importActual<typeof i18next>("react-i18next");
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => {
        const value = resolveTranslationKey(enTranslations, key);
        return typeof value === "string" ? value : key;
      },
      i18n: {
        language: "en",
        changeLanguage: vi.fn(),
      },
    }),
    Trans: ({ i18nKey, children }: { i18nKey?: string; children?: React.ReactNode }) => {
      return children || i18nKey;
    }
  };
});

import "../i18n";
