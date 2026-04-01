import { useTranslation } from "react-i18next";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { Title, Text } from "../ui/Text";

export function AboutTab() {
  const { t } = useTranslation();
  const LANGUAGES = ["english", "spanish", "italian"] as const;
  return (
    <div className="space-y-12">
      <section className="max-w-4xl">
        <Text className="space-y-5">
          <p>
            {t("about.hero_description_1")}
            <span className="font-semibold text-text-main">
              {t("about.hero_location_italy")}
            </span>
            {t("about.hero_and_previously")}
            <span className="font-semibold text-text-main">
              {t("about.hero_location_nyc")}
            </span>
            .
          </p>
          <p>{t("about.hero_description_2")}</p>
          <p>{t("about.hero_description_3")}</p>
          <p>{t("about.hero_description_4")}</p>
        </Text>
      </section>

      <section className="space-y-10">
        <Title>{t("about.experience_title")}</Title>
        <ExperienceTimeline />
      </section>

      <section className="space-y-10">
        <Title>{t("about.languages_title")}</Title>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {LANGUAGES.map((lang) => (
            <div
              key={lang}
              className="p-5 border border-border-subtle bg-bg-app hover:border-text-main/20 hover:bg-text-main/[0.02] transition-all duration-normal group"
            >
              <p className="text-tiny font-mono uppercase tracking-widest text-text-muted mb-2 group-hover:text-text-main/60 transition-colors">
                {t(`about.languages.${lang}_level`)}
              </p>
              <p className="text-base font-bold text-text-main tracking-tight">
                {t(`about.languages.${lang}_name`)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
