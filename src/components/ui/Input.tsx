import React from "react";
import { cn } from "../../utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = ({ label, className, id, ...props }: InputProps) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-3 group">
      <label
        htmlFor={inputId}
        className="text-xs font-mono uppercase tracking-widest text-text-muted group-hover:text-text-main/60 transition-colors block"
      >
        {label}
      </label>
      <div className="relative overflow-hidden">
        <input
          id={inputId}
          {...props}
          className={cn(
            "w-full bg-bg-app border border-border-subtle px-4 py-3.5 text-md text-text-main focus:outline-none focus:border-text-main/20 hover:bg-text-main/[0.02] transition-all duration-300 placeholder:text-text-muted/40",
            className,
          )}
        />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-text-main scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-20" />
      </div>
    </div>
  );
};

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea = ({ label, className, id, ...props }: TextAreaProps) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-3 group">
      <label
        htmlFor={inputId}
        className="text-xs font-mono uppercase tracking-widest text-text-muted group-hover:text-text-main/60 transition-colors block"
      >
        {label}
      </label>
      <div className="relative overflow-hidden">
        <textarea
          id={inputId}
          {...props}
          className={cn(
            "w-full bg-bg-app border border-border-subtle px-4 py-3.5 text-md text-text-main focus:outline-none focus:border-text-main/20 hover:bg-text-main/[0.02] transition-all duration-300 placeholder:text-text-muted/40 resize-none",
            className,
          )}
        />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-text-main scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-20" />
      </div>
    </div>
  );
};
