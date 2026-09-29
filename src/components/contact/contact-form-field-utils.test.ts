import { describe, expect, it } from "vitest";
import { buildContactFieldConfigs } from "./contact-form-fields-config";
import { getContactErrorMessage } from "./contact-form-errors";
import { getContactFieldClass } from "./fieldClass";

const copy = {
  name: "Name",
  email: "Email",
  message: "Message",
  messageHelper: "Helper",
  placeholders: {
    name: "Your name",
    email: "you@example.com",
    message: "Message",
  },
  errors: {
    "contact.form.errors.name": "Name error",
  },
} as const;

describe("buildContactFieldConfigs", () => {
  it("defines the three contact fields with validation limits", () => {
    const fields = buildContactFieldConfigs(copy as never);

    expect(fields.map((field) => field.name)).toEqual(["name", "email", "message"]);
    expect(fields[0]).toMatchObject({ minLength: 2, maxLength: 100 });
    expect(fields[1]).toMatchObject({ type: "email", maxLength: 254 });
    expect(fields[2]).toMatchObject({
      multiline: true,
      minLength: 10,
      maxLength: 5000,
      hint: "Helper",
    });
  });
});

describe("getContactErrorMessage", () => {
  it("returns null for missing keys", () => {
    expect(getContactErrorMessage(copy.errors as never, undefined)).toBeNull();
  });

  it("maps known error keys to copy", () => {
    expect(
      getContactErrorMessage(copy.errors as never, "contact.form.errors.name"),
    ).toBe("Name error");
  });
});

describe("getContactFieldClass", () => {
  it("adds error styles when validation fails", () => {
    expect(getContactFieldClass(true)).toContain("border-it-red");
    expect(getContactFieldClass(false)).not.toContain("border-it-red");
  });
});
