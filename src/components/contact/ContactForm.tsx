import { useState, useId } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsHydrated } from "../../utils/hydration";
import { Text } from "../ui/Typography";
import { Section } from "../ui/ReactLayout";
import { contactSchema, type ContactFormData } from "./contact-schema";
import type { ContactFormCopy } from "./contact-form-copy";
import { submitContactForm } from "./submit-contact-form";
import { ContactFormFields } from "./ContactFormFields";
import {
  NETLIFY_CONTACT_FORM_NAME,
  NETLIFY_HONEYPOT_FIELD,
} from "./netlify-form-constants";

type FormStatus = "idle" | "success" | "error";

function ContactFormSuccess({
  copy,
  onReset,
}: {
  copy: ContactFormCopy;
  onReset: () => void;
}) {
  return (
    <Section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div
        className="space-y-4 border border-it-green/20 bg-it-green/5 p-6 text-center sm:p-8"
        role="status"
        aria-live="polite"
      >
        <Text color="main" size="lg" className="font-bold uppercase tracking-widest">
          {copy.success}
        </Text>
        <Text size="sm" className="text-secondary">
          {copy.successDetail}
        </Text>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-bold uppercase tracking-widest text-text-main underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-main/30"
        >
          {copy.successAction}
        </button>
      </div>
    </Section>
  );
}

type ContactFormProps = {
  copy: ContactFormCopy;
};

export function ContactForm({ copy }: ContactFormProps) {
  const isHydrated = useIsHydrated();
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

  const onSubmit: SubmitHandler<ContactFormData> = async (data, event) => {
    const form = event?.target;
    const honeypotEntry = form instanceof HTMLFormElement
      ? new FormData(form).get(NETLIFY_HONEYPOT_FIELD)
      : null;
    const honeypotValue = typeof honeypotEntry === "string" ? honeypotEntry : "";

    setStatus("idle");
    const result = await submitContactForm(data, honeypotValue);
    if (result === "success") {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  };

  if (status === "success") {
    return <ContactFormSuccess copy={copy} onReset={() => setStatus("idle")} />;
  }

  return (
    <Section width="full">
      <form
        noValidate={isHydrated}
        name={NETLIFY_CONTACT_FORM_NAME}
        data-contact-form="interactive"
        data-hydrated={isHydrated ? "true" : "false"}
        method="POST"
        data-netlify="true"
        netlify-honeypot={NETLIFY_HONEYPOT_FIELD}
        onSubmit={handleSubmit(onSubmit)}
        aria-busy={isSubmitting}
        className="space-y-6"
      >
        <input type="hidden" name="form-name" value={NETLIFY_CONTACT_FORM_NAME} />
        <div className="sr-only" aria-hidden="true">
          <label>
            Don&apos;t fill this out if you&apos;re human:{" "}
            <input
              name={NETLIFY_HONEYPOT_FIELD}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        <ContactFormFields id={id} register={register} errors={errors} copy={copy} />

        <div className="space-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative inline-flex min-h-11 items-center bg-text-main px-6 py-3 text-xs font-bold uppercase tracking-widest text-bg-app transition-all hover:pr-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-main/30 disabled:opacity-50"
          >
            {isSubmitting ? copy.sending : copy.send}
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
                {copy.error}
              </Text>
              <Text color="error" size="sm" className="mt-1 text-it-red">
                {copy.errorDetail}
              </Text>
            </div>
          ) : null}
        </div>
      </form>
    </Section>
  );
}
