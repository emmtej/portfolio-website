import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { ContactField } from "./ContactField";
import { getContactErrorMessage } from "./contact-form-errors";
import { buildContactFieldConfigs } from "./contact-form-fields-config";
import type { ContactFormData } from "./contact-schema";
import type { ContactFormCopy } from "./contact-form-copy";

export function ContactFormFields({
  id,
  register,
  errors,
  copy,
}: {
  id: string;
  register: UseFormRegister<ContactFormData>;
  errors: FieldErrors<ContactFormData>;
  copy: ContactFormCopy;
}) {
  const fields = buildContactFieldConfigs(copy);

  return (
    <div className="space-y-5">
      {fields.map((config) => (
        <ContactField
          key={config.name}
          formId={id}
          config={config}
          register={register}
          error={getContactErrorMessage(
            copy.errors,
            errors[config.name]?.message,
          )}
        />
      ))}
    </div>
  );
}
