import { useEffect, createElement } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

/**
 * Interface for error response from Laravel/server
 */
export interface ServerError {
  response?: {
    data?: {
      errors?: Record<string, string[]>;
    };
  };
}

/**
 * Custom hook to synchronize validation errors from server (Laravel)
 * to react-hook-form state and display them as a single toast notification
 *
 * @template T - Type of form fields (extends FieldValues)
 * @param {ServerError | null | undefined} error - Error object from API call (e.g., from React Query)
 * @param {UseFormReturn<T>} form - Form object from useForm hook
 */
export function useServerValidation<T extends FieldValues>(
  error: unknown,
  form: UseFormReturn<T>,
) {
  useEffect(() => {
    // Type guard to check if error has the expected structure
    const serverError = error as ServerError;

    if (serverError?.response?.data?.errors) {
      const serverErrors = serverError.response.data.errors;
      const errorMessages: string[] = [];

      Object.entries(serverErrors).forEach(([field, messages]) => {
        const errorMessage = Array.isArray(messages) ? messages[0] : messages;

        // Set error to form field
        form.setError(field as Path<T>, {
          type: "server",
          message: errorMessage,
        });

        // Collect error message
        errorMessages.push(errorMessage);
      });

      // Display all errors in a single toast with proper line breaks
      if (errorMessages.length > 0) {
        const errorElements = errorMessages.map((message, index) =>
          createElement(
            "div",
            {
              key: index,
              style: {
                marginBottom: index < errorMessages.length - 1 ? "4px" : "0",
              },
            },
            `• ${message}`,
          ),
        );

        toast.error(`Gagal memproses data (${errorMessages.length} error)`, {
          description: createElement("div", null, errorElements),
          duration: 5000,
        });
      }
    } else {
      form.clearErrors();
    }
  }, [error, form]);
}
