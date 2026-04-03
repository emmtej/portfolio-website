import React from "react";
import { cn } from "../../utils/cn";
import { Label } from "./Text";

interface FormFieldProps {
  label: string;
  error?: string;
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField = ({
  label,
  error,
  id,
  children,
  className,
}: FormFieldProps) => {
  return (
    <div className={cn("space-y-3 group w-full", className)}>
      <Label
        as="label"
        htmlFor={id}
        color={error ? "error" : "muted"}
        className="block group-hover:text-text-main/60"
      >
        {label}
      </Label>
      
      <div className="relative overflow-hidden">
        {children}
        
        {/* Animated focus/hover line */}
        <div
          className={cn(
            "absolute bottom-0 left-0 w-full h-[1px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-20 group-has-[:disabled]:hidden",
            error ? "bg-it-red" : "bg-text-main",
          )}
        />
      </div>

      {error && (
        <Label
          size="tiny"
          color="error"
          className="block animate-in fade-in slide-in-from-top-1"
        >
          {error}
        </Label>
      )}
    </div>
  );
};
