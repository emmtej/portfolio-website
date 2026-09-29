import { describe, it, expect, vi } from "vitest";
import { submitContactForm } from "./submit-contact-form";

describe("submitContactForm", () => {
  it("posts urlencoded body to /", async () => {
    const fetchImpl = vi.fn(() =>
      Promise.resolve(new Response(null, { status: 200 })),
    ) as unknown as typeof fetch;

    const result = await submitContactForm(
      { name: "Jo", email: "a@b.co", message: "1234567890" },
      "",
      fetchImpl,
    );

    expect(result).toBe("success");
    expect(fetchImpl).toHaveBeenCalledWith("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "form-name=contact&bot-field=&name=Jo&email=a%40b.co&message=1234567890",
    });
  });

  it("preserves a filled honeypot value for Netlify spam detection", async () => {
    const fetchImpl = vi.fn(() =>
      Promise.resolve(new Response(null, { status: 200 })),
    ) as unknown as typeof fetch;

    await submitContactForm(
      { name: "Jo", email: "a@b.co", message: "1234567890" },
      "spam bot",
      fetchImpl,
    );

    const body = String(
      (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0][1]?.body,
    );
    expect(new URLSearchParams(body).get("bot-field")).toBe("spam bot");
  });

  it("returns error when response is not ok", async () => {
    const fetchImpl = vi.fn(() =>
      Promise.resolve(new Response(null, { status: 500 })),
    ) as unknown as typeof fetch;

    const result = await submitContactForm(
      { name: "Jo", email: "a@b.co", message: "1234567890" },
      "",
      fetchImpl,
    );

    expect(result).toBe("error");
  });

  it("returns error when fetch rejects", async () => {
    const fetchImpl = vi.fn(() => Promise.reject(new Error("network"))) as unknown as typeof fetch;

    const result = await submitContactForm(
      { name: "Jo", email: "a@b.co", message: "1234567890" },
      "",
      fetchImpl,
    );

    expect(result).toBe("error");
  });
});
