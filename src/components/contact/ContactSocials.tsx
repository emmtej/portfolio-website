import { LinkCard } from "../ui/LinkCard";
import { Title } from "../ui/Text";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/emmtej",
    value: "emmtej",
    icon: "GH",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    value: "emmanuel-tejeda",
    icon: "LI",
  },
  {
    label: "Email",
    href: "mailto:contact@emmanueltejeda.com",
    value: "contact",
    icon: "EM",
  },
];

export function ContactSocials() {
  return (
    <section className="space-y-8 pt-10 border-t border-border-subtle">
      <Title>Find me on</Title>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SOCIALS.map((social) => (
          <LinkCard
            key={social.label}
            label={social.label}
            href={social.href}
            value={social.value}
            icon={social.icon}
          />
        ))}
      </div>
    </section>
  );
}
