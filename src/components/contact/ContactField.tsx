import type { UseFormRegister } from "react-hook-form";
import { Text } from "../ui/Typography";
import type { ContactFormData } from "./contact-schema";
import type { ContactFieldConfig } from "./contact-form-fields-config";
import { getContactFieldClass } from "./fieldClass";

export function ContactField({
  formId,
  config,
  register,
  error,
}: {
  formId: string;
  config: ContactFieldConfig;
  register: UseFormRegister<ContactFormData>;
  error: string | null;
}) {
  const fieldId = `${formId}-${config.name}`;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;
  const hasError = Boolean(error);
  const describedBy = hasError ? errorId : config.hint ? hintId : undefined;
  const sharedProps = {
    id: fieldId,
    ...register(config.name),
    required: true,
    maxLength: config.maxLength,
    ...(config.minLength !== undefined ? { minLength: config.minLength } : {}),
    autoComplete: config.autoComplete,
    "aria-invalid": hasError ? ("true" as const) : undefined,
    "aria-describedby": describedBy,
    placeholder: config.placeholder,
    className: getContactFieldClass(
      hasError,
      config.multiline ? "resize-y min-h-[8rem]" : undefined,
    ),
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={fieldId}
        className="text-xs font-bold uppercase tracking-widest text-secondary"
      >
        {config.label}
      </label>
      {config.multiline ? (
        <textarea {...sharedProps} rows={5} />
      ) : (
        <input {...sharedProps} type={config.type ?? "text"} />
      )}
      {config.hint && !error ? (
        <Text id={hintId} size="sm" className="text-tertiary">
          {config.hint}
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
