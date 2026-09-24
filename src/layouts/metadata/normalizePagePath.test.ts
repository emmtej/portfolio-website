import { describe, expect, it } from "vitest";
import { normalizePagePath } from "./normalizePagePath";

describe("normalizePagePath", () => {
  it("keeps the root path unchanged", () => {
    expect(normalizePagePath("/")).toBe("/");
  });

  it("adds a trailing slash to nested paths", () => {
    expect(normalizePagePath("/contact")).toBe("/contact/");
  });

  it("removes duplicate trailing slashes before normalizing", () => {
    expect(normalizePagePath("/development///")).toBe("/development/");
  });
});
