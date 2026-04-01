import React from "react";
import { cn } from "../../utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-3 group w-full">
        <label
          htmlFor={inputId}
          className={cn(
            "text-xs font-mono uppercase tracking-widest transition-colors block",
            error ? "text-it-red" : "text-text-muted group-hover:text-text-main/60",
          )}
        >
          {label}
        </label>
        <div className="relative overflow-hidden">
          <input
            id={inputId}
            ref={ref}
            {...props}
            className={cn(
              "w-full bg-bg-app border border-border-subtle px-4 py-3.5 text-md text-text-main focus:outline-none focus:border-text-main/20 hover:bg-text-main/[0.02] transition-all duration-300 placeholder:text-text-muted/40 disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-it-red/30 focus:border-it-red/50",
              className,
            )}
          />
          <div
            className={cn(
              "absolute bottom-0 left-0 w-full h-[1px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-20 group-has-[:disabled]:hidden",
              error ? "bg-it-red" : "bg-text-main",
            )}
          />
        </div>
        {error && (
          <span className="text-[10px] font-mono text-it-red uppercase tracking-widest block animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>
    );
  },
);

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-3 group w-full">
        <label
          htmlFor={inputId}
          className={cn(
            "text-xs font-mono uppercase tracking-widest transition-colors block",
            error ? "text-it-red" : "text-text-muted group-hover:text-text-main/60",
          )}
        >
          {label}
        </label>
        <div className="relative overflow-hidden">
          <textarea
            id={inputId}
            ref={ref}
            {...props}
            className={cn(
              "w-full bg-bg-app border border-border-subtle px-4 py-3.5 text-md text-text-main focus:outline-none focus:border-text-main/20 hover:bg-text-main/[0.02] transition-all duration-300 placeholder:text-text-muted/40 resize-none disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-it-red/30 focus:border-it-red/50",
              className,
            )}
          />
          <div
            className={cn(
              "absolute bottom-0 left-0 w-full h-[1px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-20 group-has-[:disabled]:hidden",
              error ? "bg-it-red" : "bg-text-main",
            )}
          />
        </div>
        {error && (
          <span className="text-[10px] font-mono text-it-red uppercase tracking-widest block animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>
    );
  },
);
