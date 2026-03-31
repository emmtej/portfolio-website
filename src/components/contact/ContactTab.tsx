import { ContactForm } from "./ContactForm";
import { ContactSocials } from "./ContactSocials";

export function ContactTab() {
  return (
    <div className="space-y-16 max-w-2xl">
      <ContactForm />
      <div className="flex items-center gap-4 opacity-20 py-2">
        <div className="h-[1px] flex-1 bg-text-main" />
        <div className="size-1.5 border border-text-main" />
        <div className="h-[1px] flex-1 bg-text-main" />
      </div>
      <ContactSocials />
    </div>
  );
}
