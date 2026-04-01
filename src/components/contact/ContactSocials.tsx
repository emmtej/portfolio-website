interface SocialLinkProps {
  label: string;
  href: string;
  value: string;
  icon: string;
}

export function SocialLink({ label, href, value, icon }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between py-4 border-b border-border-subtle hover:border-text-main/40 transition-colors duration-500"
    >
      <div className="flex items-center gap-5">
        <span className="text-[10px] font-mono text-text-muted/40 group-hover:text-text-main/60 transition-colors duration-500">
          [{icon}]
        </span>
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-text-main/60 group-hover:text-text-main transition-colors duration-500">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-4 overflow-hidden">
        <span className="hidden md:block text-xs font-mono text-text-muted/0 translate-x-4 group-hover:translate-x-0 group-hover:text-text-muted/40 transition-all duration-500 ease-out">
          {value}
        </span>
        <div className="relative w-4 h-4 overflow-hidden">
          <svg
            width="14"
            height="14"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 text-text-muted/40 group-hover:text-text-main transition-all duration-500 -translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0"
          >
            <path
              d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
          <svg
            width="14"
            height="14"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 text-text-muted/20 group-hover:translate-x-full group-hover:translate-y-full transition-all duration-500"
          >
            <path
              d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </a>
  );
}
