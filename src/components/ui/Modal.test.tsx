import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Modal } from "./Modal";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  document.body.style.overflow = "";
});

function renderModal(props: Partial<Parameters<typeof Modal>[0]> = {}) {
  const onClose = vi.fn();
  render(
    <Modal
      onClose={onClose}
      title="Test Modal"
      closeLabel="Close test modal"
      {...props}
    >
      <button>First</button>
      <button>Last</button>
    </Modal>,
  );
  return { onClose };
}

describe("Modal – rendering", () => {
  it("renders children when mounted", () => {
    renderModal();
    expect(screen.getByText("First")).toBeTruthy();
    expect(screen.getByText("Last")).toBeTruthy();
  });

  it("renders a named dialog with a visible heading", () => {
    renderModal();
    const dialog = screen.getByRole("dialog", { name: "Test Modal" });
    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Test Modal",
    });
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("aria-labelledby")).toBe(heading.id);
  });
});

describe("Modal – scroll lock", () => {
  it("sets body overflow to hidden when mounted", () => {
    renderModal();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body overflow when unmounted", () => {
    const { unmount } = render(
      <Modal
        onClose={vi.fn()}
        title="Test Modal"
        closeLabel="Close test modal"
      >
        <button>child</button>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("unset");
  });
});

describe("Modal – Escape key", () => {
  it("calls onClose when Escape is pressed", () => {
    const { onClose } = renderModal();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose for other keys", () => {
    const { onClose } = renderModal();
    fireEvent.keyDown(window, { key: "Enter" });
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe("Modal – backdrop click", () => {
  it("calls onClose when backdrop is clicked", () => {
    const { onClose } = renderModal();
    // Backdrop is the first sibling of the dialog inside the fixed container
    const backdrop = document
      .querySelector(".fixed.inset-0")
      ?.querySelector(".absolute.inset-0") as HTMLElement;
    expect(backdrop).toBeTruthy();
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("Modal – close button", () => {
  it("calls onClose when the close button is clicked", () => {
    const { onClose } = renderModal();
    const closeBtn = screen.getByRole("button", {
      name: "Close test modal",
    });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("Modal – focus trap", () => {
  it("traps Tab within the modal (wraps to first from last)", () => {
    render(
      <Modal
        onClose={vi.fn()}
        title="Test Modal"
        closeLabel="Close test modal"
      >
        <button data-testid="btn-a">A</button>
        <button data-testid="btn-b">B</button>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog", { name: "Test Modal" });
    const closeButton = screen.getByRole("button", {
      name: "Close test modal",
    });
    const btnB = screen.getByTestId("btn-b");
    btnB.focus();

    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: false });
    expect(document.activeElement).toBe(closeButton);
  });

  it("traps Shift+Tab within the modal (wraps to last from first)", () => {
    render(
      <Modal
        onClose={vi.fn()}
        title="Test Modal"
        closeLabel="Close test modal"
      >
        <button data-testid="btn-a">A</button>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog", { name: "Test Modal" });
    const closeButton = screen.getByRole("button", {
      name: "Close test modal",
    });
    const btnA = screen.getByTestId("btn-a");
    closeButton.focus();

    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(btnA);
  });
});
