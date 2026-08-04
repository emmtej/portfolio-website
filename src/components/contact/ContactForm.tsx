import {
  useState,
  useId,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import { useForm, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../../utils/cn";
import { Text } from "../ui/Typography";
import { Section } from "../ui/ReactLayout";
import {
  CONTACT_FORM_LIMITS,
  contactSchema,
  type ContactErrorKey,
  type ContactFormData,
} from "./contact-schema";
import { submitContactForm } from "./submit-contact-form";

type FormStatus = "idle" | "success" | "error";
type ContactFormTranslationKey =
  | ContactErrorKey
  | "contact.form.name"
  | "contact.form.email"
  | "contact.form.message"
  | "contact.form.message_helper"
  | "contact.form.placeholders.name"
  | "contact.form.placeholders.email"
  | "contact.form.placeholders.message";
type ContactFormTranslator = (key: ContactFormTranslationKey) => string;

const subscribeToHydration = () => () => undefined;
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

function getErrorMessage(
  t: ContactFormTranslator,
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
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

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
        <Text id={hintId} size="sm" className="text-tertiary">
          {hint}
        </Text>
      ) : null}
      {error ? (
        <Text
          id={errorId}
          color="error"
          size="sm"
          className="font-mono"
          role="alert"
        >
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
  t: ContactFormTranslator;
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
          maxLength={CONTACT_FORM_LIMITS.name}
          autoComplete="name"
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? `${id}-name-error` : undefined}
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
          maxLength={CONTACT_FORM_LIMITS.email}
          autoComplete="email"
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? `${id}-email-error` : undefined}
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
          maxLength={CONTACT_FORM_LIMITS.message}
          rows={5}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={
            errors.message ? `${id}-message-error` : `${id}-message-hint`
          }
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
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );

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
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("idle");
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
        noValidate={isHydrated}
        name="contact"
        data-contact-form="interactive"
        data-hydrated={isHydrated ? "true" : "false"}
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit(onSubmit)}
        aria-busy={isSubmitting}
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
            disabled={isSubmitting}
            className="group relative bg-text-main px-6 py-3 text-xs font-bold uppercase tracking-widest text-bg-app transition-all hover:pr-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-main/30 disabled:opacity-50"
          >
            {isSubmitting ? t("contact.form.sending") : t("contact.form.send")}
            <span
              aria-hidden="true"
              className="absolute right-4 opacity-0 transition-opacity group-hover:opacity-100"
            >
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
              <Text color="error" size="sm" className="mt-1 text-it-red">
                {t("contact.form.error_detail")}
              </Text>
            </div>
          ) : null}
        </div>
      </form>
    </Section>
  );
}
