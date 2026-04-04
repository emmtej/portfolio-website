import { useTranslation } from "react-i18next";
import { ContactForm } from "./ContactForm";
import { Text, Title } from "../ui/Text";
import { SocialLink } from "./ContactSocials";
import { SOCIALS } from "./constants";
import { RomeAvailability } from "../ui/RomeAvailability";
import { ErrorBoundary } from "../ui/ErrorBoundary";

export function ContactTab() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10 md:space-y-12">
      <div className="space-y-4 md:space-y-6">
        <div className="space-y-4 md:space-y-6 max-w-3xl">
          <Title>{t("contact.title")}</Title>
          <Text className="text-sm md:text-base leading-relaxed">
            {t("contact.intro")}
          </Text>
        </div>
        <ErrorBoundary>
          <RomeAvailability />
        </ErrorBoundary>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <ContactForm />
        </div>

        <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
          <Title>{t("contact.find_me_title")}</Title>
          <div className="flex flex-col">
            {SOCIALS.map((social) => (
              <SocialLink
                key={social.label}
                label={social.label}
                href={social.href}
                value={social.value}
                icon={social.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
