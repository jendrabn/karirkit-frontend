import z from "zod";
import { api } from "./api-client";
import { isAxiosError } from "axios";
import type { User } from "@/types/user";
import type {
  LoginResponse,
  OtpResponse,
  OtpStatusResponse,
  LoginOtpData,
} from "@/types/auth";
import {
  queryOptions,
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";

const AUTH_SESSION_HINT_KEY = "karirkit-auth-session-hint";

const isBrowser = () => typeof window !== "undefined";

export const hasAuthSessionHint = () => {
  if (!isBrowser()) {
    return false;
  }

  return window.localStorage.getItem(AUTH_SESSION_HINT_KEY) === "true";
};

export const markAuthSessionHint = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_HINT_KEY, "true");
};

export const clearAuthSessionHint = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_HINT_KEY);
};

export const getUser = async (): Promise<User | null> => {
  try {
    return await api.get("/account/me", {
      skipGeneralErrorToast: true,
    });
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      clearAuthSessionHint();
      return null;
    }

    throw error;
  }
};

export const userQueryKey = ["user"];

export const userQueryKeyOptions = () =>
  queryOptions({
    queryKey: userQueryKey,
    queryFn: getUser,
  });

export const syncAuthenticatedUser = async (queryClient: QueryClient) => {
  const user = await getUser();

  queryClient.setQueryData(userQueryKey, user);
  if (user) {
    markAuthSessionHint();
  }
  await queryClient.invalidateQueries({ queryKey: userQueryKey });

  return user;
};

type UseUserOptions = {
  queryConfig?: QueryConfig<typeof userQueryKeyOptions>;
};

export const useUser = ({ queryConfig }: UseUserOptions = {}) =>
  useQuery({
    ...userQueryKeyOptions(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...queryConfig,
    enabled: queryConfig?.enabled ?? hasAuthSessionHint(),
  });

export const registerInputSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nama minimal 2 karakter")
      .max(100, "Nama maksimal 100 karakter"),

    email: z.string().email("Email tidak valid"),

    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar")
      .regex(/[a-z]/, "Password harus mengandung huruf kecil")
      .regex(/[0-9]/, "Password harus mengandung angka"),

    confirm_password: z.string().min(1, "Konfirmasi password wajib diisi"),

    phone: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value || value.trim() === "") return true; // Allow empty values
          return /^(\+62|62|0)8[1-9][0-9]{6,9}$/.test(value);
        },
        {
          message: "Nomor HP tidak valid",
        }
      ),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirm_password"],
  });

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const register = (data: RegisterInput): Promise<User> => {
  return api.post("/auth/register", data);
};

export const useRegister = ({ onSuccess }: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      onSuccess?.();
    },
  });
};

export const loginInputSchema = z.object({
  identifier: z
    .string()
    .min(1, "Username atau email wajib diisi")
    .refine(
      (value) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const isUsername = /^[a-zA-Z0-9_]{3,50}$/.test(value);
        return isEmail || isUsername;
      },
      {
        message: "Masukkan username atau email yang valid",
      }
    ),

  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const login = (data: LoginInput): Promise<LoginResponse> => {
  return api.post("/auth/login", data);
};

export const useLogin = ({
  onSuccess,
  onOtpRequired,
}: {
  onSuccess?: () => void;
  onOtpRequired?: (data: LoginOtpData) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: async (response) => {
      if (response && "requires_otp" in response && response.requires_otp) {
        onOtpRequired?.(response as LoginOtpData);
      } else if (response) {
        await syncAuthenticatedUser(queryClient);
        onSuccess?.();
      }
    },
  });
};

// OTP Verification APIs
export const verifyOtpInputSchema = z.object({
  identifier: z.string().min(1, "Identifier wajib diisi"),
  otp_code: z
    .string()
    .min(6, "Kode OTP minimal 6 digit")
    .max(6, "Kode OTP maksimal 6 digit"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpInputSchema>;

export const verifyOtp = (data: VerifyOtpInput): Promise<User> => {
  return api.post("/auth/verify-otp", data);
};

export const useVerifyOtp = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: async () => {
      await syncAuthenticatedUser(queryClient);
      onSuccess?.();
    },
  });
};

export const resendOtpInputSchema = z.object({
  identifier: z.string().min(1, "Identifier wajib diisi"),
});

export type ResendOtpInput = z.infer<typeof resendOtpInputSchema>;

export const resendOtp = async (data: ResendOtpInput): Promise<OtpResponse> => {
  return api.post("/auth/resend-otp", data);
};

export const useResendOtp = ({
  onSuccess,
}: {
  onSuccess?: (data: OtpResponse) => void;
}) => {
  return useMutation({
    mutationFn: resendOtp,
    onSuccess,
  });
};

export const checkOtpStatusInputSchema = z.object({
  identifier: z.string().min(1, "Identifier wajib diisi"),
});

export type CheckOtpStatusInput = z.infer<typeof checkOtpStatusInputSchema>;

export const checkOtpStatus = async (
  data: CheckOtpStatusInput
): Promise<OtpStatusResponse> => {
  return api.post("/auth/check-otp-status", data);
};

export const useCheckOtpStatus = () => {
  return useMutation({
    mutationFn: checkOtpStatus,
  });
};

export const forgotPasswordInputSchema = z.object({
  identifier: z.string().min(1, "Username atau email wajib diisi"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;

export const forgotPassword = async (
  data: ForgotPasswordInput
): Promise<OtpResponse> => {
  return api.post("/auth/forgot-password", data);
};

export const useForgotPassword = ({
  onSuccess,
}: {
  onSuccess?: (data: OtpResponse) => void;
} = {}) => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess,
  });
};

export const resetPasswordInputSchema = z
  .object({
    identifier: z.string().min(1, "Identifier wajib diisi"),
    otp_code: z
      .string()
      .min(6, "OTP harus 6 digit")
      .max(6, "OTP harus 6 digit"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar")
      .regex(/[a-z]/, "Password harus mengandung huruf kecil")
      .regex(/[0-9]/, "Password harus mengandung angka"),
    confirm_password: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirm_password"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;

export const resetPassword = async (
  data: ResetPasswordInput
): Promise<User> => {
  return api.post("/auth/reset-password", data);
};

export const useResetPassword = ({
  onSuccess,
}: {
  onSuccess?: (user: User) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: async () => {
      const user = await syncAuthenticatedUser(queryClient);
      if (user) {
        onSuccess?.(user);
      }
    },
  });
};

export const logout = (): Promise<null> => {
  return api.post("/auth/logout");
};

export const useLogout = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all queries to remove any user-specific data
      queryClient.removeQueries();
      clearAuthSessionHint();
      onSuccess?.();
    },
  });
};
