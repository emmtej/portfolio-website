export type RomeAvailabilityDisplay = {
  location: string;
  statusLabel: string;
  statusEmoji: "☀️" | "🌙";
  subtitle: string;
};

export function buildRomeAvailabilityDisplay(
  t: (key: string, fallback?: string) => string,
  available: boolean,
  romeTime: string,
): RomeAvailabilityDisplay {
  const location = t("contact.availability.location", "Italy");
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
