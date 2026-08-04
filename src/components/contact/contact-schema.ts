import * as z from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "contact.form.errors.name"),
  email: z.string().email("contact.form.errors.email"),
  message: z.string().min(10, "contact.form.errors.message"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type ContactErrorKey =
  | "contact.form.errors.name"
  | "contact.form.errors.email"
  | "contact.form.errors.message";
