import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Button } from "./Button";

afterEach(() => {
  cleanup();
});

describe("Button", () => {
  it("renders children for primary button", () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole("button", { name: "Submit" })).toBeTruthy();
  });

  it("renders anchor when as='a'", () => {
    render(
      <Button as="a" href="https://example.com">
        Visit
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Visit" });
    expect(link.getAttribute("href")).toBe("https://example.com");
  });

  it("disables button while loading", () => {
    render(<Button isLoading>Save</Button>);
    expect((screen.getByRole("button", { name: "Save" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it("disables button on success", () => {
    render(<Button isSuccess>Done</Button>);
    expect((screen.getByRole("button", { name: "Done" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it("renders outline variant without hover overlay wrapper issues", () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button", { name: "Outline" })).toBeTruthy();
  });
});
