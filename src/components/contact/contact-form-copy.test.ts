import { describe, expect, it } from "vitest";
import { buildContactFormCopy } from "./contact-form-copy";
import en from "../../locales/en/translation.json";
import itLocale from "../../locales/it/translation.json";
import { resolveTranslationKey } from "../../utils/resolve-translation-key";

function makeT(locale: typeof en) {
  return (key: string) => {
    const value = resolveTranslationKey(locale, key);
    return typeof value === "string" ? value : key;
  };
}

describe("buildContactFormCopy", () => {
  it("maps EN contact form strings including error keys", () => {
    const copy = buildContactFormCopy(makeT(en));

    expect(copy.send).toBe("Send Message");
    expect(copy.errors["contact.form.errors.email"]).toBe("Invalid email address");
  });

  it("maps IT contact form strings", () => {
    const copy = buildContactFormCopy(makeT(itLocale));

    expect(copy.send).toBe("Invia Messaggio");
    expect(copy.errors["contact.form.errors.name"]).toBe(
      "Il nome deve avere almeno 2 caratteri",
    );
  });
});
