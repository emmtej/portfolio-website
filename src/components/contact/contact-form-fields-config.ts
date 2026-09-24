import {
  CONTACT_FORM_LIMITS,
  type ContactFormData,
} from "./contact-schema";
import type { ContactFormCopy } from "./contact-form-copy";

export type ContactFieldName = keyof ContactFormData;

export interface ContactFieldConfig {
  name: ContactFieldName;
  label: string;
  placeholder: string;
  autoComplete: string;
  type?: "email";
  multiline?: boolean;
  minLength?: number;
  maxLength: number;
  hint?: string;
}

export function buildContactFieldConfigs(
  copy: ContactFormCopy,
): ContactFieldConfig[] {
  return [
    {
      name: "name",
      label: copy.name,
      placeholder: copy.placeholders.name,
      autoComplete: "name",
      minLength: 2,
      maxLength: CONTACT_FORM_LIMITS.name,
    },
    {
      name: "email",
      label: copy.email,
      placeholder: copy.placeholders.email,
      autoComplete: "email",
      type: "email",
      maxLength: CONTACT_FORM_LIMITS.email,
    },
    {
      name: "message",
      label: copy.message,
      placeholder: copy.placeholders.message,
      autoComplete: "off",
      multiline: true,
      minLength: 10,
      maxLength: CONTACT_FORM_LIMITS.message,
      hint: copy.messageHelper,
    },
  ];
}
