import { describe, it, expect } from "vitest";
import en from "../locales/en/translation.json";
import itTranslations from "../locales/it/translation.json";

function collectKeys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (child !== null && typeof child === "object" && !Array.isArray(child)) {
      return collectKeys(child, path);
    }
    return [path];
  });
}

describe("locale key parity", () => {
  it("keeps EN and IT translation key sets identical", () => {
    const enKeys = collectKeys(en).sort();
    const itKeys = collectKeys(itTranslations).sort();

    const onlyEn = enKeys.filter((key) => !itKeys.includes(key));
    const onlyIt = itKeys.filter((key) => !enKeys.includes(key));

    expect({ onlyEn, onlyIt }).toEqual({ onlyEn: [], onlyIt: [] });
  });
});
