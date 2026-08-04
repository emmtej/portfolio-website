import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import { ContactForm } from "./ContactForm";

const EN = {
  nameError: "Name must be at least 2 characters",
  emailError: "Please enter a valid email address",
  messageError: "Message must be at least 10 characters",
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
  // Use a regex to match the name since it has a hidden ">" span
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
    it("has native HTML5 validation attributes on fields", () => {
      render(<ContactForm />);
      const { name, email, message } = getFormFields();
      
      expect((name as HTMLInputElement).required).toBe(true);
      expect((name as HTMLInputElement).minLength).toBe(2);

      expect((email as HTMLInputElement).required).toBe(true);
      expect((email as HTMLInputElement).type).toBe("email");

      expect((message as HTMLTextAreaElement).required).toBe(true);
      expect((message as HTMLTextAreaElement).minLength).toBe(10);
    });

    it("shows validation errors on empty submit", async () => {
      render(<ContactForm />);
      clickSubmit();

      expect(await screen.findByText(EN.nameError)).toBeTruthy();
      expect(screen.getByText("Invalid email address")).toBeTruthy();
      expect(screen.getByText(EN.messageError)).toBeTruthy();
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
