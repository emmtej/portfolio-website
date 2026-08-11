import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { useRomeNavDotHost } from "./useRomeNavDot";
import { ROME_NAV_DOT_HOST_ID } from "../components/ui/rome-availability-ids";

function NavDotProbe() {
  const host = useRomeNavDotHost();
  return <div data-testid="probe" data-has-host={host ? "true" : "false"} />;
}

describe("useRomeNavDotHost", () => {
  describe("with nav host", () => {
    beforeEach(() => {
      const host = document.createElement("span");
      host.id = ROME_NAV_DOT_HOST_ID;

      const placeholder = document.createElement("span");
      placeholder.dataset.romeNavDotPlaceholder = "";
      placeholder.textContent = "placeholder";
      host.appendChild(placeholder);

      const preservedChild = document.createElement("span");
      preservedChild.dataset.testPreservedChild = "";
      host.appendChild(preservedChild);

      document.body.appendChild(host);
    });

    afterEach(() => {
      cleanup();
      document.getElementById(ROME_NAV_DOT_HOST_ID)?.remove();
    });

    it("returns the nav dot host and removes only the SSR placeholder", () => {
      const host = document.getElementById(ROME_NAV_DOT_HOST_ID);
      expect(host?.querySelector("[data-rome-nav-dot-placeholder]")).toBeTruthy();

      render(<NavDotProbe />);

      expect(host?.querySelector("[data-rome-nav-dot-placeholder]")).toBeNull();
      expect(host?.querySelector("[data-test-preserved-child]")).toBeTruthy();
      expect(screenProbe()).toBe("true");
    });
  });

  describe("without nav host", () => {
    afterEach(() => {
      cleanup();
    });

    it("returns null when the host is missing", () => {
      render(<NavDotProbe />);
      expect(screenProbe()).toBe("false");
    });
  });
});

function screenProbe() {
  return document.querySelector('[data-testid="probe"]')?.getAttribute("data-has-host");
}
