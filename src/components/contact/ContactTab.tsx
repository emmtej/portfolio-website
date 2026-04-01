import { ContactForm } from "./ContactForm";
import { ContactSocials } from "./ContactSocials";

export function ContactTab() {
  return (
    <div className="space-y-10">
      <ContactSocials />
      <ContactForm />
    </div>
  );
}
