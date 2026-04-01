import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the main layout shell", () => {
    const { container } = render(<App />);
    expect(container.querySelector("main")).toBeTruthy();
  });
});
