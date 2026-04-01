import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input, TextArea } from "../ui/Input";
import { Text, Title } from "../ui/Text";
import { Button } from "../ui/Button";
import { ArrowRightIcon } from "../ui/icons/ArrowRightIcon";
import { SocialLink } from "./ContactSocials";
import { SOCIALS } from "./constants";
import { translateContactFieldError } from "./contactFormErrors";
import { RomeAvailability } from "../ui/RomeAvailability";

const contactSchema = z.object({
  name: z.string().min(2, "contact.form.errors.name_min"),
  email: z.string().email("contact.form.errors.email_invalid"),
  message: z.string().min(10, "contact.form.errors.message_min"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null);

    // Prepare Netlify form submission
    const payload = new URLSearchParams({
      "form-name": "contact",
      ...data,
    });

    try {
      const response = await fetch("/", {
        method: "POST",
        body: payload.toString(),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (!response.ok) throw new Error("Submission failed");

      setIsSubmitted(true);
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      console.error("Netlify form error:", err);
      setSubmitError(t("contact.form.error"));
    }
  };

  return (
    <div className="space-y-10 md:space-y-12">
      <div className="space-y-4 md:space-y-6">
        <div className="space-y-4 md:space-y-6 max-w-3xl">
          <Title>{t("contact.title")}</Title>
          <Text className="text-sm md:text-base leading-relaxed">
            {t("contact.intro")}
          </Text>
        </div>
        <RomeAvailability />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            name="contact"
            method="POST"
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
                {...register("name")}
                error={translateContactFieldError(t, errors.name?.message)}
                placeholder={t("contact.form.placeholders.name")}
                disabled={isSubmitting || isSubmitted}
              />
              <Input
                label={t("contact.form.email")}
                {...register("email")}
                error={translateContactFieldError(t, errors.email?.message)}
                placeholder={t("contact.form.placeholders.email")}
                disabled={isSubmitting || isSubmitted}
              />
            </div>

            <TextArea
              label={t("contact.form.message")}
              {...register("message")}
              error={translateContactFieldError(t, errors.message?.message)}
              rows={4}
              placeholder={t("contact.form.placeholders.message")}
              disabled={isSubmitting || isSubmitted}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
              <Button
                type="submit"
                isLoading={isSubmitting}
                isSuccess={isSubmitted}
                rightIcon={<ArrowRightIcon />}
                className="w-full shrink-0 sm:w-fit"
              >
                {isSubmitting
                  ? t("contact.form.sending")
                  : isSubmitted
                    ? t("contact.form.success")
                    : t("contact.form.send")}
              </Button>

              {submitError && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full text-xs font-mono text-it-red uppercase tracking-widest sm:w-auto"
                >
                  {submitError}
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
