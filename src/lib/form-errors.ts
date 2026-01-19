import { toast } from "sonner";
import type { FieldErrors, FieldValues } from "react-hook-form";
import { createElement } from "react";

/**
 * Display form validation errors (from Zod/client-side) as a single toast notification
 *
 * @template T - Type of form fields (extends FieldValues)
 * @param {FieldErrors<T>} errors - Errors object from react-hook-form formState
 */
export function displayFormErrors<T extends FieldValues>(
  errors: FieldErrors<T>,
) {
  // Helper function to recursively get all error messages
  const getErrorMessages = (
    errors: FieldErrors<T>,
    path: string = "",
  ): Array<{ field: string; message: string }> => {
    const messages: Array<{ field: string; message: string }> = [];

    Object.entries(errors).forEach(([key, error]) => {
      const currentPath = path ? `${path}.${key}` : key;

      if (error && typeof error === "object") {
        // Check if it's a field error with a message
        if ("message" in error && typeof error.message === "string") {
          messages.push({
            field: currentPath,
            message: error.message,
          });
        }

        // Check if it's a nested array of errors (for field arrays)
        if (Array.isArray(error)) {
          error.forEach((item, index) => {
            if (item && typeof item === "object") {
              const nestedMessages = getErrorMessages(
                item as FieldErrors<T>,
                `${currentPath}[${index}]`,
              );
              messages.push(...nestedMessages);
            }
          });
        }
        // Check if it has nested errors (for nested objects)
        else if (!("message" in error)) {
          const nestedMessages = getErrorMessages(
            error as FieldErrors<T>,
            currentPath,
          );
          messages.push(...nestedMessages);
        }
      }
    });

    return messages;
  };

  const errorMessages = getErrorMessages(errors);

  if (errorMessages.length === 0) {
    return;
  }

  // Create React element with proper line breaks
  const errorElements = errorMessages.map(({ message }, index) =>
    createElement(
      "div",
      {
        key: index,
        style: { marginBottom: index < errorMessages.length - 1 ? "4px" : "0" },
      },
      `• ${message}`,
    ),
  );

  // Display single toast with all errors
  toast.error("Kesalahan Validasi", {
    description: createElement("div", null, errorElements),
    duration: 3000,
  });
}
