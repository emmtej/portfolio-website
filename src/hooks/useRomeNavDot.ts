import { useLayoutEffect } from "react";
import { ROME_NAV_DOT_HOST_ID } from "../components/ui/rome-availability-ids";
import { useIsHydrated } from "../utils/hydration";

/** Resolves the nav dot portal host and clears any SSR placeholder once. */
export function useRomeNavDotHost(): HTMLElement | null {
  const isHydrated = useIsHydrated();
  const navDotHost = isHydrated
    ? document.getElementById(ROME_NAV_DOT_HOST_ID)
    : null;

  useLayoutEffect(() => {
    navDotHost
      ?.querySelector("[data-rome-nav-dot-placeholder]")
      ?.remove();
  }, [navDotHost]);

  return navDotHost;
}
