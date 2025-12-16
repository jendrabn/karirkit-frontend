import * as React from "react";
import { cn } from "@/lib/utils";

interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export const FormError = React.forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className, message, ...props }, ref) => {
    if (!message) return null;

    return (
      <p
        ref={ref}
        className={cn("text-sm text-destructive mt-1", className)}
        {...props}
      >
        {message}
      </p>
    );
  }
);

FormError.displayName = "FormError";

interface FormInputWrapperProps {
  children: React.ReactNode;
  error?: string;
  label: string;
  htmlFor: string;
}

export function FormInputWrapper({ children, error, label, htmlFor }: FormInputWrapperProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className={cn(error && "[&>input]:border-destructive focus-visible:[&>input]:ring-destructive")}>
        {children}
      </div>
      <FormError message={error} />
    </div>
  );
}
