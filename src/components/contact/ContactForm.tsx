import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "../../utils/cn";
import { Input, TextArea } from "../ui/Input";
import { Text, Title } from "../ui/Text";
import { SocialLink } from "./ContactSocials";
import { SOCIALS } from "./constants";

export function ContactForm() {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const contactSchema = z.object({
    name: z.string().min(2, t("contact.form.errors.name_min")),
    email: z.email(t("contact.form.errors.email_invalid")),
    message: z.string().min(10, t("contact.form.errors.message_min")),
  });

  type ContactFormData = z.infer<typeof contactSchema>;

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
    const formData = new FormData();
    formData.append("form-name", "contact");
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch("/", {
        method: "POST",
        body: new URLSearchParams(formData as any).toString(),
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
    <div className="space-y-12 lg:space-y-16">
      <div className="space-y-6 max-w-3xl">
        <Title>{t("contact.title")}</Title>
        <Text className="text-sm md:text-base leading-relaxed">
          {t("contact.intro")}
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            name="contact"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
          >
            <input
              type="hidden"
              {...register("name")}
              value="contact"
              name="form-name"
            />
            <p className="hidden">
              <label>
                Don’t fill this out if you're human: <input name="bot-field" />
              </label>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label={t("contact.form.name")}
                {...register("name")}
                error={errors.name?.message}
                placeholder="John Doe"
                disabled={isSubmitting || isSubmitted}
              />
              <Input
                label={t("contact.form.email")}
                {...register("email")}
                error={errors.email?.message}
                placeholder="john@example.com"
                disabled={isSubmitting || isSubmitted}
              />
            </div>

            <TextArea
              label={t("contact.form.message")}
              {...register("message")}
              error={errors.message?.message}
              rows={4}
              placeholder="Tell me more about your project..."
              disabled={isSubmitting || isSubmitted}
            />

            <div className="flex flex-col md:flex-row items-center gap-6">
              <motion.button
                initial="initial"
                whileHover={!isSubmitting && !isSubmitted ? "hover" : ""}
                whileTap={!isSubmitting && !isSubmitted ? "tap" : ""}
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={cn(
                  "group relative flex items-center justify-center gap-4 w-full md:w-fit px-8 py-4 bg-text-main text-bg-app text-xs font-bold uppercase tracking-[0.2em] overflow-hidden transition-opacity duration-300",
                  (isSubmitting || isSubmitted) &&
                    "opacity-70 cursor-not-allowed",
                )}
              >
                {!isSubmitting && !isSubmitted && (
                  <motion.div
                    variants={{
                      initial: { y: "100%" },
                      hover: { y: 0 },
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 bg-white/5"
                  />
                )}

                <span className="relative z-10">
                  {isSubmitting
                    ? t("contact.form.sending")
                    : isSubmitted
                      ? t("contact.form.success")
                      : t("contact.form.send")}
                </span>

                {!isSubmitting && !isSubmitted && (
                  <motion.svg
                    variants={{
                      initial: { x: 0 },
                      hover: { x: 5 },
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    width="14"
                    height="14"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10"
                  >
                    <path
                      d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </motion.svg>
                )}
              </motion.button>

              {submitError && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs font-mono text-it-red uppercase tracking-widest"
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
