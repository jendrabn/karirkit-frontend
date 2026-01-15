import { useEffect } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

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
 * to react-hook-form state
 *
 * @template T - Type of form fields (extends FieldValues)
 * @param {ServerError | null | undefined} error - Error object from API call (e.g., from React Query)
 * @param {UseFormReturn<T>} form - Form object from useForm hook
 */
export function useServerValidation<T extends FieldValues>(
  error: unknown,
  form: UseFormReturn<T>
) {
  useEffect(() => {
    // Type guard to check if error has the expected structure
    const serverError = error as ServerError;

    if (serverError?.response?.data?.errors) {
      const serverErrors = serverError.response.data.errors;

      Object.entries(serverErrors).forEach(([field, messages]) => {
        form.setError(field as Path<T>, {
          type: "server",
          message: Array.isArray(messages) ? messages[0] : messages,
        });
      });
    } else {
      form.clearErrors();
    }
  }, [error, form]);
}
