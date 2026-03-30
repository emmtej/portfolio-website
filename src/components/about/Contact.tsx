export function Contact() {
  const links = [
    {
      label: "GitHub",
      href: "https://github.com",
      value: "github.com/emmtej",
    },

    {
      label: "Email",
      href: "mailto:hello@example.com",
      value: "contact@emmanueltejeda.com",
    },
  ];

  return (
    <section className="space-y-4">
      <h2 className="uppercase font-semibold tracking-[0.1em] text-text-main/80 text-xs">
        Contact
      </h2>
      <div className="space-y-4">
        {links.map((link) => (
          <div key={link.label} className="flex items-center gap-4">
            <span className="text-[11px] font-semibold text-text-main/30 uppercase tracking-widest w-20">
              {link.label}
            </span>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative text-[14px] font-medium text-text-main/80 hover:text-text-main transition-colors duration-200"
            >
              {link.value}
              <span className="absolute left-0 -bottom-0.5 w-full h-[1.5px] bg-text-main/10 group-hover:bg-text-main/80 transition-all duration-300" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
