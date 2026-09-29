import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Text } from "./Typography";
import { Section } from "./ReactLayout";

afterEach(() => {
  cleanup();
});

describe("Text", () => {
  it("renders heading variants with semantic elements by default", () => {
    render(
      <>
        <Text variant="h2">Section title</Text>
        <Text variant="h3">Subheading</Text>
      </>,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Section title" }).tagName).toBe("H2");
    expect(screen.getByRole("heading", { level: 3, name: "Subheading" }).tagName).toBe("H3");
  });

  it("allows overriding the default element with as", () => {
    render(<Text variant="h2" as="p">Styled paragraph</Text>);
    expect(screen.getByText("Styled paragraph").tagName).toBe("P");
  });
});

describe("Section", () => {
  it("renders section titles as h2 elements", () => {
    render(
      <Section title="Get in touch">
        <p>Body</p>
      </Section>,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Get in touch" }).tagName).toBe("H2");
  });
});
