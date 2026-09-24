import { describe, expect, it } from "vitest";
import {
  getSocialLinkAriaLabel,
  getSocialLinkType,
  isMailtoLink,
} from "./social-link";

describe("social link helpers", () => {
  it("detects mailto links", () => {
    expect(isMailtoLink("mailto:test@example.com")).toBe(true);
    expect(isMailtoLink("https://example.com")).toBe(false);
  });

  it("builds aria labels and button types", () => {
    expect(getSocialLinkAriaLabel("Email", "test@example.com", true)).toBe(
      "Copy Email: test@example.com",
    );
    expect(getSocialLinkAriaLabel("GitHub", "emmtej", false)).toBe(
      "Visit GitHub: emmtej",
    );
    expect(getSocialLinkType(true)).toBe("button");
    expect(getSocialLinkType(false)).toBeUndefined();
  });
});
