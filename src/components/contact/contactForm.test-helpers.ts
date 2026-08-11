import { fireEvent, screen } from "@testing-library/react";
import { buildContactFormCopy } from "./contact-form-copy";
import enTranslations from "../../locales/en/translation.json";
import { resolveTranslationKey } from "../../utils/resolve-translation-key";

const t = (key: string) => {
  const value = resolveTranslationKey(enTranslations, key);
  return typeof value === "string" ? value : key;
};

export const contactFormTestCopy = buildContactFormCopy(t);

export const contactFormTestLabels = {
  nameError: contactFormTestCopy.errors["contact.form.errors.name"],
  emailError: contactFormTestCopy.errors["contact.form.errors.email"],
  messageError: contactFormTestCopy.errors["contact.form.errors.message"],
  nameMaxError: contactFormTestCopy.errors["contact.form.errors.name_max"],
  emailMaxError: contactFormTestCopy.errors["contact.form.errors.email_max"],
  messageMaxError: contactFormTestCopy.errors["contact.form.errors.message_max"],
  send: contactFormTestCopy.send,
  sending: contactFormTestCopy.sending,
  success: contactFormTestCopy.success,
  submitError: contactFormTestCopy.error,
} as const;

export function getContactFormFields() {
  return {
    name: screen.getByLabelText(contactFormTestCopy.name),
    email: screen.getByLabelText(contactFormTestCopy.email),
    message: screen.getByLabelText(contactFormTestCopy.message),
  };
}

export function fillValidContactForm() {
  const { name, email, message } = getContactFormFields();
  fireEvent.change(name, { target: { value: "Jo" } });
  fireEvent.change(email, { target: { value: "a@b.co" } });
  fireEvent.change(message, {
    target: { value: "1234567890" },
  });
}

export function clickContactFormSubmit() {
  fireEvent.click(
    screen.getByRole("button", {
      name: new RegExp(contactFormTestLabels.send, "i"),
    }),
  );
}
