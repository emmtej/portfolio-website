function showCopyFeedback(element: Element, copiedLabel: string) {
  const feedback = element.querySelector(".copy-feedback");
  const display = element.querySelector(".value-display");

  if (!feedback || !display) {
    return;
  }

  if (!feedback.textContent?.trim()) {
    feedback.textContent = copiedLabel;
  }

  feedback.classList.remove("opacity-0", "translate-y-2", "pointer-events-none");
  feedback.classList.add("opacity-100", "translate-y-0");

  display.classList.remove("opacity-100", "translate-y-0");
  display.classList.add("opacity-0", "-translate-y-2");

  window.setTimeout(() => {
    feedback.classList.add("opacity-0", "translate-y-2", "pointer-events-none");
    feedback.classList.remove("opacity-100", "translate-y-0");

    display.classList.add("opacity-100", "translate-y-0");
    display.classList.remove("opacity-0", "-translate-y-2");
  }, 2000);
}

export function initSocialLinkCopy() {
  document
    .querySelectorAll('.social-link:not([data-copy-initialized="true"])')
    .forEach((element) => {
      element.setAttribute("data-copy-initialized", "true");
      element.addEventListener("click", async (event) => {
      const isMailto = element.getAttribute("data-is-mailto") === "true";

      if (!isMailto) {
        return;
      }

      event.preventDefault();
      const href = element.getAttribute("data-href");
      const email = href?.replace("mailto:", "") || "";
      const copiedLabel = element.getAttribute("data-copied-label") || "Copied!";

      try {
        await navigator.clipboard.writeText(email);
        showCopyFeedback(element, copiedLabel);
      } catch (error) {
        console.error("Failed to copy email:", error);
        if (href) {
          window.location.href = href;
        }
      }
    });
  });
}
