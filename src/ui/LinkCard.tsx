import React from "react";

interface LinkCardProps {
  label: string;
  value: string;
  icon: string;
  href: string;
  className?: string;
}

export function LinkCard({ label, value, icon, href, className = "" }: LinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group p-5 border border-border-subtle bg-bg-app hover:border-text-main/20 hover:bg-text-main/[0.02] transition-all duration-300 relative overflow-hidden block ${className}`}
    >
      <div className="relative z-10">
        <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-text-muted mb-3 group-hover:text-text-main/60 transition-colors">
          {label}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-bold text-text-main tracking-tight">
            {value}
          </p>
          <span className="text-[10px] font-mono text-text-muted/40 group-hover:text-text-main/40 transition-colors">
            [{icon}]
          </span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-text-main scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-20" />
    </a>
  );
}
