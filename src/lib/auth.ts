import z from "zod";
import { api } from "./api-client";
import type { User } from "@/types/api";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const getUser = (): Promise<User> => {
  return api.get("/account/me");
};

export const userQueryKey = ["user"];

export const userQueryKeyOptions = () =>
  queryOptions({
    queryKey: userQueryKey,
    queryFn: getUser,
  });

export const useUser = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

export const registerInputSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nama minimal 2 karakter")
      .max(100, "Nama maksimal 100 karakter"),

    username: z
      .string()
      .min(3, "Username minimal 3 karakter")
      .max(50, "Username maksimal 50 karakter")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username hanya boleh huruf, angka, dan underscore"
      ),

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
      // Don't set user data in cache after registration
      // User should log in explicitly after registration
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

export type LoginOtpResponse = {
  message: string;
  requires_otp: boolean;
  expires_at: number;
  expires_in: number;
  resend_available_at: number;
};

export type LoginResponse = User | LoginOtpResponse;

export const login = (data: LoginInput): Promise<LoginResponse> => {
  return api.post("/auth/login", data);
};

export const useLogin = ({
  onSuccess,
  onOtpRequired,
}: {
  onSuccess?: () => void;
  onOtpRequired?: (data: LoginOtpResponse) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      if ("requires_otp" in response && response.requires_otp) {
        onOtpRequired?.(response as LoginOtpResponse);
      } else {
        queryClient.setQueryData(userQueryKey, response as User);
        queryClient.invalidateQueries({ queryKey: userQueryKey });
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
    onSuccess: (user) => {
      queryClient.setQueryData(userQueryKey, user);
      queryClient.invalidateQueries({ queryKey: userQueryKey });
      onSuccess?.();
    },
  });
};

export const resendOtpInputSchema = z.object({
  identifier: z.string().min(1, "Identifier wajib diisi"),
});

export type ResendOtpInput = z.infer<typeof resendOtpInputSchema>;

export type ResendOtpResponse = {
  message: string;
  expires_at: number;
  expires_in: number;
  resend_available_at: number;
};

export const resendOtp = async (
  data: ResendOtpInput
): Promise<ResendOtpResponse> => {
  return (await api.post("/auth/resend-otp", data)) as ResendOtpResponse;
};

export const useResendOtp = ({
  onSuccess,
}: {
  onSuccess?: (data: ResendOtpResponse) => void;
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

export type CheckOtpStatusResponse = {
  has_active_otp: boolean;
  expires_at?: number;
  expires_in?: number;
  resend_available_at?: number;
};

export const checkOtpStatus = async (
  data: CheckOtpStatusInput
): Promise<CheckOtpStatusResponse> => {
  return (await api.post(
    "/auth/check-otp-status",
    data
  )) as CheckOtpStatusResponse;
};

export const useCheckOtpStatus = () => {
  return useMutation({
    mutationFn: checkOtpStatus,
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
      onSuccess?.();
    },
  });
};
