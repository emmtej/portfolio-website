import type { TFunction } from "i18next";

const CONTACT_ZOD_ERROR_KEYS = [
  "contact.form.errors.name_min",
  "contact.form.errors.email_invalid",
  "contact.form.errors.message_min",
] as const;

function isContactZodErrorKey(
  message: string,
): message is (typeof CONTACT_ZOD_ERROR_KEYS)[number] {
  return (CONTACT_ZOD_ERROR_KEYS as readonly string[]).includes(message);
}

/** Maps Zod issue messages (i18n keys) to translated copy. */
export function translateContactFieldError(
  t: TFunction,
  message: string | undefined,
): string | undefined {
  if (!message || !isContactZodErrorKey(message)) return undefined;
  return t(message);
}
