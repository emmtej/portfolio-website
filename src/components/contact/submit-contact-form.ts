import type { ContactFormData } from "./contact-schema";

export type SubmitContactResult = "success" | "error";

export async function submitContactForm(
  data: ContactFormData,
  fetchImpl: typeof fetch = fetch,
): Promise<SubmitContactResult> {
  const body = new URLSearchParams();
  body.append("form-name", "contact");
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
