export function normalizePagePath(pathname: string): string {
  if (pathname === "/") {
    return pathname;
  }

  return `${pathname.replace(/\/+$/, "")}/`;
}
