import { useState, useId, useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import { useForm, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../../utils/cn";
import { Text } from "../ui/Typography";
import { Section } from "../ui/ReactLayout";
import {
  contactSchema,
  type ContactErrorKey,
  type ContactFormData,
} from "./contact-schema";
import { submitContactForm } from "./submit-contact-form";

type FormStatus = "idle" | "submitting" | "success" | "error";

function getErrorMessage(
  t: (key: string) => string,
  key: string | undefined,
): string | null {
  if (!key) return null;
  return t(key as ContactErrorKey);
}

function ContactFormSuccess({ onReset }: { onReset: () => void }) {
  const { t } = useTranslation();

  return (
    <Section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div
        className="space-y-4 border border-it-green/20 bg-it-green/5 p-6 text-center sm:p-8"
        role="status"
        aria-live="polite"
      >
        <Text color="main" size="lg" className="font-bold uppercase tracking-widest">
          {t("contact.form.success")}
        </Text>
        <Text size="sm" className="text-secondary">
          {t("contact.form.success_detail")}
        </Text>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-bold uppercase tracking-widest text-text-main underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-main/30"
        >
          {t("contact.form.success_action")}
        </button>
      </div>
    </Section>
  );
}

function ContactFormField({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error: string | null;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-xs font-bold uppercase tracking-widest text-secondary"
      >
        {label}
      </label>
      {children}
      {hint && !error ? (
        <Text size="sm" className="text-tertiary">
          {hint}
        </Text>
      ) : null}
      {error ? (
        <Text color="error" size="sm" className="font-mono" role="alert">
          {error}
        </Text>
      ) : null}
    </div>
  );
}

function ContactFormFields({
  id,
  register,
  errors,
  t,
}: {
  id: string;
  register: UseFormRegister<ContactFormData>;
  errors: FieldErrors<ContactFormData>;
  t: (key: string) => string;
}) {
  const fieldClass = (hasError: boolean) =>
    cn(
      "w-full border border-border-subtle bg-bg-app p-3 text-sm text-text-main outline-none transition-colors placeholder-secondary focus:border-text-main focus-visible:ring-2 focus-visible:ring-text-main/15",
      hasError && "border-it-red focus:border-it-red focus-visible:ring-it-red/20",
    );

  return (
    <div className="space-y-5">
      <ContactFormField
        id={`${id}-name`}
        label={t("contact.form.name")}
        error={getErrorMessage(t, errors.name?.message)}
      >
        <input
          id={`${id}-name`}
          {...register("name")}
          required
          minLength={2}
          autoComplete="name"
          placeholder={t("contact.form.placeholders.name")}
          className={fieldClass(!!errors.name)}
        />
      </ContactFormField>

      <ContactFormField
        id={`${id}-email`}
        label={t("contact.form.email")}
        error={getErrorMessage(t, errors.email?.message)}
      >
        <input
          id={`${id}-email`}
          type="email"
          {...register("email")}
          required
          autoComplete="email"
          placeholder={t("contact.form.placeholders.email")}
          className={fieldClass(!!errors.email)}
        />
      </ContactFormField>

      <ContactFormField
        id={`${id}-message`}
        label={t("contact.form.message")}
        error={getErrorMessage(t, errors.message?.message)}
        hint={t("contact.form.message_helper")}
      >
        <textarea
          id={`${id}-message`}
          {...register("message")}
          required
          minLength={10}
          rows={5}
          placeholder={t("contact.form.placeholders.message")}
          className={cn(fieldClass(!!errors.message), "resize-y min-h-[8rem]")}
        />
      </ContactFormField>
    </div>
  );
}

type ContactFormProps = {
  locale?: string;
};

export function ContactForm({ locale = "en" }: ContactFormProps) {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale);
    }
  }, [i18n, locale]);

  const id = useId();
  const [status, setStatus] = useState<FormStatus>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("submitting");
    const result = await submitContactForm(data);
    if (result === "success") {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  };

  if (status === "success") {
    return <ContactFormSuccess onReset={() => setStatus("idle")} />;
  }

  return (
    <Section width="full">
      <form
        noValidate
        name="contact"
        data-contact-form="interactive"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <input type="hidden" name="form-name" value="contact" />
        <div className="hidden">
          <label>
            Don&apos;t fill this out if you&apos;re human: <input name="bot-field" />
          </label>
        </div>

        <ContactFormFields id={id} register={register} errors={errors} t={t} />

        <div className="space-y-3">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="group relative bg-text-main px-6 py-3 text-xs font-bold uppercase tracking-widest text-bg-app transition-all hover:pr-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-main/30 disabled:opacity-50"
          >
            {status === "submitting" ? t("contact.form.sending") : t("contact.form.send")}
            <span className="absolute right-4 opacity-0 transition-opacity group-hover:opacity-100">
              &gt;
            </span>
          </button>

          {status === "error" ? (
            <div
              className="border border-it-red/20 bg-it-rose/30 p-4"
              role="alert"
              aria-live="assertive"
            >
              <Text color="error" size="sm" className="font-bold">
                {t("contact.form.error")}
              </Text>
              <Text color="error" size="sm" className="mt-1 text-it-red/90">
                {t("contact.form.error_detail")}
              </Text>
            </div>
          ) : null}
        </div>
      </form>
    </Section>
  );
}
