import type { ContactErrorKey } from "./contact-schema";

export type ContactFormCopy = {
  name: string;
  email: string;
  message: string;
  messageHelper: string;
  placeholders: {
    name: string;
    email: string;
    message: string;
  };
  send: string;
  sending: string;
  success: string;
  successDetail: string;
  successAction: string;
  error: string;
  errorDetail: string;
  errors: Record<ContactErrorKey, string>;
};

type Translate = (key: string) => string | unknown;

export function buildContactFormCopy(t: Translate): ContactFormCopy {
  const str = (key: string) => {
    const value = t(key);
    return typeof value === "string" ? value : key;
  };

  return {
    name: str("contact.form.name"),
    email: str("contact.form.email"),
    message: str("contact.form.message"),
    messageHelper: str("contact.form.message_helper"),
    placeholders: {
      name: str("contact.form.placeholders.name"),
      email: str("contact.form.placeholders.email"),
      message: str("contact.form.placeholders.message"),
    },
    send: str("contact.form.send"),
    sending: str("contact.form.sending"),
    success: str("contact.form.success"),
    successDetail: str("contact.form.success_detail"),
    successAction: str("contact.form.success_action"),
    error: str("contact.form.error"),
    errorDetail: str("contact.form.error_detail"),
    errors: {
      "contact.form.errors.name": str("contact.form.errors.name"),
      "contact.form.errors.name_max": str("contact.form.errors.name_max"),
      "contact.form.errors.email": str("contact.form.errors.email"),
      "contact.form.errors.email_max": str("contact.form.errors.email_max"),
      "contact.form.errors.message": str("contact.form.errors.message"),
      "contact.form.errors.message_max": str("contact.form.errors.message_max"),
    },
  };
}
