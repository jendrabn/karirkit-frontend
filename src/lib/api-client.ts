import Axios, {
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { env } from "@/config/env";
import { toast } from "sonner";

const SUBSCRIPTION_ERROR_MESSAGES: Record<string, string> = {
  CV_LIMIT_REACHED:
    "Batas CV Anda sudah tercapai. Upgrade paket di halaman Langganan untuk menambah kuota.",
  APPLICATION_LIMIT_REACHED:
    "Batas application tracker Anda sudah tercapai. Upgrade paket di halaman Langganan untuk menambah kuota.",
  APP_LETTER_LIMIT_REACHED:
    "Batas surat lamaran Anda sudah tercapai. Upgrade paket di halaman Langganan untuk menambah kuota.",
  PREMIUM_TEMPLATE_REQUIRED:
    "Template premium hanya tersedia untuk pengguna Pro atau Max. Upgrade paket di halaman Langganan untuk melanjutkan.",
  DOCUMENT_ACCESS_DENIED:
    "Fitur dokumen hanya tersedia untuk pengguna Pro atau Max. Upgrade paket di halaman Langganan untuk membuka akses.",
};

declare module "axios" {
  interface AxiosRequestConfig {
    skipGeneralErrorToast?: boolean;
  }
}

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
  async (error) => {
    const skipGeneralErrorToast =
      (error.config as AxiosRequestConfig | undefined)?.skipGeneralErrorToast ===
      true;

    // Normalize blob error payloads before inspecting them downstream.
    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const jsonData = JSON.parse(text);
        error.response.data = jsonData;
      } catch (e) {
        console.error("Failed to parse blob error response:", e);
      }
    }

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
                payload.suspended_until,
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

    const errorCode = error.response?.data?.code;
    const handledSubscriptionCode =
      typeof errorCode === "string" && SUBSCRIPTION_ERROR_MESSAGES[errorCode];

    if (!skipGeneralErrorToast && handledSubscriptionCode) {
      toast.error(SUBSCRIPTION_ERROR_MESSAGES[errorCode]);
    }

    // Handle general errors
    if (
      !skipGeneralErrorToast &&
      !handledSubscriptionCode &&
      error.response?.data?.errors?.general
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

    return Promise.reject(error);
  },
);
