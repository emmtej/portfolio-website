import React from "react";
import { cn } from "../../utils/cn";
import { FormField } from "./FormField";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, containerClassName, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <FormField label={label} error={error} id={inputId} className={containerClassName}>
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
      </FormField>
    );
  },
);

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, id, containerClassName, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <FormField label={label} error={error} id={inputId} className={containerClassName}>
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
      </FormField>
    );
  },
);

Input.displayName = "Input";
TextArea.displayName = "TextArea";
