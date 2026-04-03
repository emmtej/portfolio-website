import { motion } from "framer-motion";
import { useActionState } from "react";
import { useTranslation } from "react-i18next";
import { Input, TextArea } from "../ui/Input";
import { Text, Title } from "../ui/Text";
import { Button } from "../ui/Button";
import { ArrowRightIcon } from "../ui/icons/ArrowRightIcon";
import { SocialLink } from "./ContactSocials";
import { SOCIALS } from "./constants";
import { RomeAvailability } from "../ui/RomeAvailability";
import { ErrorBoundary } from "../ui/ErrorBoundary";

async function submitContactForm(prevState: unknown, formData: FormData) {
  const payload = new URLSearchParams(formData as unknown as Record<string, string>);
  payload.set("form-name", "contact");

  try {
    const response = await fetch("/", {
      method: "POST",
      body: payload.toString(),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (!response.ok) throw new Error("Submission failed");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "contact.form.error" };
  }
}

export function ContactForm() {
  const { t } = useTranslation();
  const [state, formAction, isPending] = useActionState(submitContactForm, { 
    success: false, 
    error: null 
  });

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
          <form
            className="space-y-5"
            action={formAction}
            name="contact"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>
                Don’t fill this out if you're human: <input name="bot-field" />
              </label>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label={t("contact.form.name")}
                name="name"
                placeholder={t("contact.form.placeholders.name")}
                disabled={isPending || state.success}
                required
                minLength={2}
              />
              <Input
                label={t("contact.form.email")}
                name="email"
                type="email"
                placeholder={t("contact.form.placeholders.email")}
                disabled={isPending || state.success}
                required
              />
            </div>

            <TextArea
              label={t("contact.form.message")}
              name="message"
              rows={4}
              placeholder={t("contact.form.placeholders.message")}
              disabled={isPending || state.success}
              required
              minLength={10}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
              <Button
                type="submit"
                isLoading={isPending}
                isSuccess={state.success}
                rightIcon={<ArrowRightIcon />}
                className="w-full shrink-0 sm:w-fit"
              >
                {isPending
                  ? t("contact.form.sending")
                  : state.success
                    ? t("contact.form.success")
                    : t("contact.form.send")}
              </Button>

              {state.error && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full text-xs font-mono text-it-red uppercase tracking-widest sm:w-auto"
                >
                  {t(state.error)}
                </motion.span>
              )}
            </div>
          </form>
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