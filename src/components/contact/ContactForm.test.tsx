import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { ContactForm } from "./ContactForm";
import { CONTACT_FORM_LIMITS } from "./contact-schema";

const EN = {
  nameError: "Name must be at least 2 characters",
  emailError: "Please enter a valid email address",
  messageError: "Message must be at least 10 characters",
  nameMaxError: "Name must be 100 characters or fewer",
  emailMaxError: "Email must be 254 characters or fewer",
  messageMaxError: "Message must be 5,000 characters or fewer",
  send: "Send Message",
  sending: "Sending...",
  success: "Message sent",
  submitError: "Message could not be sent",
} as const;

function getFormFields() {
  return {
    name: screen.getByLabelText("Name"),
    email: screen.getByLabelText("Email"),
    message: screen.getByLabelText("Message"),
  };
}

function fillValidForm() {
  const { name, email, message } = getFormFields();
  fireEvent.change(name, { target: { value: "Jo" } });
  fireEvent.change(email, { target: { value: "a@b.co" } });
  fireEvent.change(message, {
    target: { value: "1234567890" },
  });
}

function clickSubmit() {
  fireEvent.click(screen.getByRole("button", { name: /Send Message/i }));
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(new Response(null, { status: 200 })),
      ) as typeof fetch,
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("validation", () => {
    it("keeps native validation active in server-rendered markup", () => {
      const markup = renderToString(<ContactForm />);

      expect(markup).toContain('data-hydrated="false"');
      expect(markup).not.toContain("novalidate");
    });

    it("switches to custom validation after hydration", async () => {
      render(<ContactForm />);
      const form = document.querySelector(
        'form[data-contact-form="interactive"]',
      ) as HTMLFormElement;

      await waitFor(() => {
        expect(form.dataset.hydrated).toBe("true");
        expect(form.noValidate).toBe(true);
      });
    });

    it("has native HTML5 validation attributes on fields", () => {
      render(<ContactForm />);
      const { name, email, message } = getFormFields();

      expect((name as HTMLInputElement).required).toBe(true);
      expect((name as HTMLInputElement).minLength).toBe(2);
      expect((name as HTMLInputElement).maxLength).toBe(
        CONTACT_FORM_LIMITS.name,
      );

      expect((email as HTMLInputElement).required).toBe(true);
      expect((email as HTMLInputElement).type).toBe("email");
      expect((email as HTMLInputElement).maxLength).toBe(
        CONTACT_FORM_LIMITS.email,
      );

      expect((message as HTMLTextAreaElement).required).toBe(true);
      expect((message as HTMLTextAreaElement).minLength).toBe(10);
      expect((message as HTMLTextAreaElement).maxLength).toBe(
        CONTACT_FORM_LIMITS.message,
      );
    });

    it("shows validation errors on empty submit", async () => {
      render(<ContactForm />);
      clickSubmit();

      expect(await screen.findByText(EN.nameError)).toBeTruthy();
      expect(screen.getByText("Invalid email address")).toBeTruthy();
      expect(screen.getByText(EN.messageError)).toBeTruthy();

      const { name, email, message } = getFormFields();
      expect(name.getAttribute("aria-invalid")).toBe("true");
      expect(email.getAttribute("aria-invalid")).toBe("true");
      expect(message.getAttribute("aria-invalid")).toBe("true");
      expect(name.getAttribute("aria-describedby")).toMatch(/-name-error$/);
      expect(email.getAttribute("aria-describedby")).toMatch(/-email-error$/);
      expect(message.getAttribute("aria-describedby")).toMatch(/-message-error$/);
    });

    it("rejects whitespace-only values after trimming", async () => {
      render(<ContactForm />);
      const { name, email, message } = getFormFields();

      fireEvent.change(name, { target: { value: "   " } });
      fireEvent.change(email, { target: { value: "a@b.co" } });
      fireEvent.change(message, { target: { value: "1234567890" } });
      clickSubmit();

      expect(await screen.findByText(EN.nameError)).toBeTruthy();
    });

    it("rejects oversized values", async () => {
      render(<ContactForm />);
      const { name, email, message } = getFormFields();

      fireEvent.change(name, { target: { value: "x".repeat(101) } });
      fireEvent.change(email, { target: { value: `${"a".repeat(250)}@b.co` } });
      fireEvent.change(message, { target: { value: "x".repeat(5001) } });
      clickSubmit();

      expect(await screen.findByText(EN.nameMaxError)).toBeTruthy();
      expect(screen.getByText(EN.emailMaxError)).toBeTruthy();
      expect(screen.getByText(EN.messageMaxError)).toBeTruthy();
    });
  });

  describe("submit success", () => {
    it("shows success state and calls fetch with encoded form body", async () => {
      const fetchMock = vi.mocked(globalThis.fetch);
      fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

      render(<ContactForm />);
      fillValidForm();
      clickSubmit();

      await waitFor(() => {
        expect(
          screen.getByText(EN.success),
        ).toBeTruthy();
      });

      expect(fetchMock).toHaveBeenCalled();
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("/");
      expect(init?.method).toBe("POST");
      expect(init?.headers).toEqual({
        "Content-Type": "application/x-www-form-urlencoded",
      });
      const body = init?.body as string;
      expect(body).toContain("form-name=contact");
      expect(body).toContain("name=Jo");
      expect(body).toContain("email=a%40b.co");
      expect(body).toContain("message=1234567890");
    });
  });

  describe("submitting / pending", () => {
    it("shows sending state while fetch is pending", async () => {
      let resolveFetch!: (value: Response) => void;
      const pending = new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      });

      const fetchMock = vi.mocked(globalThis.fetch);
      fetchMock.mockReturnValueOnce(pending);

      render(<ContactForm />);
      fillValidForm();
      clickSubmit();

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /Sending\.\.\./i }),
        ).toBeTruthy();
      });

      const sendingButton = screen.getByRole("button", {
        name: /Sending\.\.\./i,
      });
      expect((sendingButton as HTMLButtonElement).disabled).toBe(true);
      fireEvent.click(sendingButton);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      resolveFetch(new Response(null, { status: 200 }));

      await waitFor(() => {
        expect(
          screen.getByText(EN.success),
        ).toBeTruthy();
      });
    });
  });

  describe("submit error", () => {
    it("shows submit error when response is not ok", async () => {
      const fetchMock = vi.mocked(globalThis.fetch);
      fetchMock.mockResolvedValueOnce(new Response(null, { status: 500 }));

      render(<ContactForm />);
      fillValidForm();
      clickSubmit();

      expect(await screen.findByText(EN.submitError)).toBeTruthy();
    });

    it("shows submit error when fetch rejects", async () => {
      const fetchMock = vi.mocked(globalThis.fetch);
      fetchMock.mockRejectedValueOnce(new Error("network"));

      render(<ContactForm />);
      fillValidForm();
      clickSubmit();

      expect(await screen.findByText(EN.submitError)).toBeTruthy();
    });
  });
});
