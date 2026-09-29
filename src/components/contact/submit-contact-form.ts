import type { ContactFormData } from "./contact-schema";
import {
  NETLIFY_CONTACT_FORM_NAME,
  NETLIFY_HONEYPOT_FIELD,
} from "./netlify-form-constants";

export type SubmitContactResult = "success" | "error";

export async function submitContactForm(
  data: ContactFormData,
  honeypotValue = "",
  fetchImpl: typeof fetch = fetch,
): Promise<SubmitContactResult> {
  const body = new URLSearchParams();
  body.append("form-name", NETLIFY_CONTACT_FORM_NAME);
  body.append(NETLIFY_HONEYPOT_FIELD, honeypotValue);
  for (const [key, value] of Object.entries(data)) {
    body.append(key, value);
  }

  try {
    const response = await fetchImpl("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    return response.ok ? "success" : "error";
  } catch {
    return "error";
  }
}
