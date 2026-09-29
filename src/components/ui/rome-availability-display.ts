export type RomeAvailabilityDisplay = {
  location: string;
  statusLabel: string;
  statusEmoji: "☀️" | "🌙";
  subtitle: string;
};

type RomeAvailabilityTranslationKey =
  | "contact.availability.location"
  | "contact.availability.available_short"
  | "contact.availability.away_short";

export function buildRomeAvailabilityDisplay(
  t: (key: RomeAvailabilityTranslationKey) => string,
  available: boolean,
  romeTime: string,
): RomeAvailabilityDisplay {
  const location = t("contact.availability.location");
  const statusLabel = available
    ? t("contact.availability.available_short")
    : t("contact.availability.away_short");

  return {
    location,
    statusLabel,
    statusEmoji: available ? "☀️" : "🌙",
    subtitle: `${romeTime} • ${statusLabel}`,
  };
}
