import { describe, it, expect } from "vitest";
import { resolveTranslationKey } from "../utils/resolve-translation-key";

const translations = {
  contact: {
    form: {
      name: "Name",
    },
  },
};

describe("resolveTranslationKey", () => {
  it("resolves nested keys", () => {
    expect(resolveTranslationKey(translations, "contact.form.name")).toBe("Name");
  });

  it("returns the key when the path is missing", () => {
    expect(resolveTranslationKey(translations, "contact.form.missing")).toBe(
      "contact.form.missing",
    );
  });
});
