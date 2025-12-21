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
    // Handle general errors
    if (error.response?.data?.errors?.general) {
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

    // if (error.response?.status === 401) {
    //   if (!window.location.pathname.startsWith("/auth/")) {
    //     const searchParams = new URLSearchParams();
    //     const redirectTo =
    //       searchParams.get("redirectTo") || window.location.pathname;
    //     window.location.href = paths.auth.login.getHref(redirectTo);
    //   }
    // }

    return Promise.reject(error);
  }
);
