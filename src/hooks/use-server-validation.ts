import { useEffect, createElement } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export interface ServerError {
  response?: {
    data?: {
      errors?: Record<string, string[]>;
    };
  };
}

export function useServerValidation<T extends FieldValues>(
  error: unknown,
  form: UseFormReturn<T>,
) {
  useEffect(() => {
    const serverError = error as ServerError;

    if (serverError?.response?.data?.errors) {
      const serverErrors = serverError.response.data.errors;
      const errorMessages: string[] = [];

      Object.entries(serverErrors).forEach(([field, messages]) => {
        if (field === "general") return;

        const errorMessage = Array.isArray(messages) ? messages[0] : messages;

        form.setError(field as Path<T>, {
          type: "server",
          message: errorMessage,
        });

        errorMessages.push(errorMessage);
      });

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
