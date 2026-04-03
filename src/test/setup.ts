import { vi } from "vitest";
import "@testing-library/react"; // Just making sure imports exist

// We must mock react-i18next so that we don't trigger React Suspense during tests 
// because HttpBackend requires asynchronous network fetching which is unavailable/mocked.
import enTranslations from "../../public/locales/en/translation.json";

vi.mock("react-i18next", async () => {
  const actual = await vi.importActual<any>("react-i18next");
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => {
        const keys = key.split(".");
        let val: any = enTranslations;
        for (const k of keys) {
          if (val && typeof val === "object") {
            val = val[k];
          } else {
            return key;
          }
        }
        return val || key;
      },
      i18n: {
        language: "en",
        changeLanguage: vi.fn(),
      },
    }),
    Trans: ({ i18nKey, children }: any) => {
      return children || i18nKey;
    }
  };
});

import "../i18n";
