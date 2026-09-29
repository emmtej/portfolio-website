export function resolveTranslationKey(
  translations: Record<string, unknown>,
  key: string,
): unknown {
  let val: unknown = translations;
  for (const part of key.split(".")) {
    if (!val || typeof val !== "object") return key;
    val = (val as Record<string, unknown>)[part];
  }
  return val ?? key;
}
