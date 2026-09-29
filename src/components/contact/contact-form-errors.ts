import type { ContactErrorKey } from "./contact-schema";
import type { ContactFormCopy } from "./contact-form-copy";

export function getContactErrorMessage(
  errors: ContactFormCopy["errors"],
  key: string | undefined,
): string | null {
  if (!key) {
    return null;
  }

  return errors[key as ContactErrorKey] ?? key;
}
