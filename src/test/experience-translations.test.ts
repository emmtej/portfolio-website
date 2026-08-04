import { describe, it, expect } from "vitest";
import en from "../locales/en/translation.json";
import itTranslations from "../locales/it/translation.json";
import { resolveTranslationKey } from "../utils/resolve-translation-key";

const experienceKeys = ["frontend", "audio_mastering", "it_intern"] as const;
const locales = { en, it: itTranslations } as const;

describe("experience translations", () => {
  for (const [locale, translations] of Object.entries(locales)) {
    describe(locale, () => {
      for (const key of experienceKeys) {
        it(`defines structured content for ${key}`, () => {
          const base = `about.experiences.${key}`;
          const time = resolveTranslationKey(translations, `${base}.time`);
          const title = resolveTranslationKey(translations, `${base}.title`);
          const company = resolveTranslationKey(translations, `${base}.company`);
          const location = resolveTranslationKey(translations, `${base}.location`);
          const bullets = resolveTranslationKey(translations, `${base}.bullets`);

          expect(typeof time).toBe("string");
          expect(typeof title).toBe("string");
          expect(typeof company).toBe("string");
          expect(typeof location).toBe("string");
          expect(Array.isArray(bullets)).toBe(true);
          expect(bullets).toEqual(
            expect.arrayContaining([expect.any(String)]),
          );
          expect((bullets as string[]).length).toBeGreaterThanOrEqual(2);
        });
      }

      it("does not reference removed employers", () => {
        const serialized = JSON.stringify(translations.about.experiences);
        expect(serialized).not.toMatch(/Brooklyn College/i);
        expect(serialized).not.toMatch(/Greative/i);
      });
    });
  }
});
