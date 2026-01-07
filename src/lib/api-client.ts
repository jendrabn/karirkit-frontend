import Axios, { type InternalAxiosRequestConfig } from "axios";

import { env } from "@/config/env";
import { toast } from "sonner";
import { setFormErrors } from "@/hooks/use-form-errors";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";
  }

  config.withCredentials = true;
  return config;
}

export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => {
    if (response.status === 204) return null;

    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      return response.data.data;
    }

    return response.data;
  },
  (error) => {
    const shouldSkipGeneralErrorToast = (() => {
      const url = error.config?.url ?? "";
      const authEndpoints = [
        "/auth/login",
        "/auth/verify-otp",
        "/auth/check-otp-status",
        "/auth/resend-otp",
      ];
      return authEndpoints.some((endpoint) => url.includes(endpoint));
    })();

    if (error.response?.status === 403) {
      const payload = error.response?.data?.data ?? error.response?.data;
      if (payload?.status && typeof payload.status === "string") {
        const reason =
          typeof payload.status_reason === "string" && payload.status_reason
            ? `Alasan: ${payload.status_reason}`
            : "";
        const until =
          typeof payload.suspended_until === "string" && payload.suspended_until
            ? `Berlaku sampai: ${new Date(
                payload.suspended_until
              ).toLocaleString("id-ID")}`
            : "";
        const messageParts = [
          `Akun ${payload.status === "banned" ? "diblokir" : "disuspend"}.`,
          reason,
          until,
        ].filter(Boolean);
        toast.error(messageParts.join(" "));
      }
    }

    // Handle general errors
    if (
      error.response?.status !== 401 &&
      error.response?.data?.errors?.general &&
      !shouldSkipGeneralErrorToast
    ) {
      const generalErrors = error.response.data.errors.general;
      if (Array.isArray(generalErrors)) {
        generalErrors.forEach((errorMessage: string) => {
          toast.error(errorMessage);
        });
      } else if (typeof generalErrors === "string") {
        toast.error(generalErrors);
      }
    }

    // Handle form validation errors
    if (error.response?.data?.errors) {
      const formErrors = error.response.data.errors;
      // Store form errors in a global variable for forms to access
      setFormErrors(formErrors);
    }

    return Promise.reject(error);
  }
);
