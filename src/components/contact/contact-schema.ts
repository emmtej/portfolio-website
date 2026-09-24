import * as z from "zod";

export const CONTACT_FORM_LIMITS = {
  name: 100,
  email: 254,
  message: 5000,
} as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "contact.form.errors.name")
    .max(CONTACT_FORM_LIMITS.name, "contact.form.errors.name_max"),
  email: z
    .string()
    .trim()
    .max(CONTACT_FORM_LIMITS.email, "contact.form.errors.email_max")
    .pipe(z.email("contact.form.errors.email")),
  message: z
    .string()
    .trim()
    .min(10, "contact.form.errors.message")
    .max(CONTACT_FORM_LIMITS.message, "contact.form.errors.message_max"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type ContactErrorKey =
  | "contact.form.errors.name"
  | "contact.form.errors.name_max"
  | "contact.form.errors.email"
  | "contact.form.errors.email_max"
  | "contact.form.errors.message"
  | "contact.form.errors.message_max";
