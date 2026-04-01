import { useTranslation } from "react-i18next";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { Title, Text } from "../ui/Text";

export function AboutTab() {
  const { t } = useTranslation();

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
    </div>
  );
}
