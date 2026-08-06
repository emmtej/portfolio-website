import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Button } from "./Button";

afterEach(() => {
  cleanup();
});

describe("Button", () => {
  it("renders children for primary button", () => {
    render(<Button>Submit</Button>);
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button.tagName).toBe("BUTTON");
    expect(
      button.querySelector('[aria-hidden="true"]')?.classList.contains(
        "group-hover:translate-y-0",
      ),
    ).toBe(true);
  });

  it("renders anchor when as='a'", () => {
    render(
      <Button as="a" href="https://example.com">
        Visit
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Visit" });
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("https://example.com");
  });

  it("renders outline variant without hover overlay wrapper issues", () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button", { name: "Outline" })).toBeTruthy();
  });

  it("honors disabled", () => {
    render(<Button disabled>Save</Button>);
    expect((screen.getByRole("button", { name: "Save" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });
});
