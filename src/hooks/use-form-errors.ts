import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

// Global store for form errors
let globalFormErrors: Record<string, string[]> = {};
const formErrorListeners: (() => void)[] = [];

export const setFormErrors = (errors: Record<string, string[]>) => {
  globalFormErrors = errors;
  // Notify all listeners
  formErrorListeners.forEach((listener) => listener());
};

export const getFormErrors = () => globalFormErrors;

export const useFormErrors = <T extends FieldValues = FieldValues>(
  form: ReturnType<typeof useForm<T>>
) => {
  useEffect(() => {
    const updateFormErrors = () => {
      const errors = getFormErrors();

      // Clear previous API errors
      Object.keys(errors).forEach((fieldName) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        form.setError(fieldName as any, {
          type: "server",
          message: errors[fieldName]?.[0] || "",
        });
      });

      // Clear global form errors after applying them
      if (Object.keys(errors).length > 0) {
        globalFormErrors = {};
      }
    };

    // Register listener
    formErrorListeners.push(updateFormErrors);

    // Initial check
    updateFormErrors();

    // Cleanup
    return () => {
      const index = formErrorListeners.indexOf(updateFormErrors);
      if (index > -1) {
        formErrorListeners.splice(index, 1);
      }
    };
  }, [form]);
};
