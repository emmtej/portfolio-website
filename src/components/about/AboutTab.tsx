import { useTranslation, Trans } from "react-i18next";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { Title, Text, Label } from "../ui/Text";
import { Surface } from "../ui/Surface";

const LANGUAGE_KEYS = [
  {
    level: "about.languages.english_level",
    name: "about.languages.english_name",
  },
  {
    level: "about.languages.spanish_level",
    name: "about.languages.spanish_name",
  },
  {
    level: "about.languages.italian_level",
    name: "about.languages.italian_name",
  },
] as const;

export function AboutTab() {
  const { t } = useTranslation();
  return (
    <div className="space-y-8 md:space-y-12">
      <section className="max-w-4xl">
        <div className="space-y-4 md:space-y-5">
          <Text>
            <Trans
              i18nKey="about.hero_intro"
              components={{
                1: <span className="font-semibold text-text-main" />,
                2: <span className="font-semibold text-text-main" />,
              }}
            />
          </Text>
          <Text>{t("about.hero_description_2")}</Text>
          <Text>{t("about.hero_description_3")}</Text>
          <Text>{t("about.hero_description_4")}</Text>
        </div>
      </section>

      <section className="space-y-6 md:space-y-8">
        <Title>{t("about.experience_title")}</Title>
        <ExperienceTimeline />
      </section>

      <section className="space-y-6 md:space-y-8">
        <Title>{t("about.languages_title")}</Title>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {LANGUAGE_KEYS.map(({ level, name }) => (
            <Surface key={level} variant="interactive" padding="sm">
              <Label
                as="p"
                size="tiny"
                className="mb-2 group-hover:text-text-main/60"
              >
                {t(level)}
              </Label>
              <p className="text-base font-bold text-text-main tracking-tight">
                {t(name)}
              </p>
            </Surface>
          ))}
        </div>
      </section>
    </div>
  );
}
