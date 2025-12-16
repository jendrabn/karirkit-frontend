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
  return api.get("/auth/me");
};

export const userQueryKey = ["user"];

export const userQueryKeyOptions = () =>
  queryOptions({
    queryKey: userQueryKey,
    queryFn: getUser,
  });

export const useUser = () => useQuery({ queryKey: ["user"], queryFn: getUser });

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
      .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, "Nomor HP tidak valid")
      .optional(),
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (user) => {
      queryClient.setQueryData(userQueryKey, user);
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

export const login = (data: LoginInput): Promise<User> => {
  return api.post("/auth/login", data);
};

export const useLogin = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(userQueryKey, user);
      onSuccess?.();
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
      queryClient.removeQueries({ queryKey: userQueryKey });
      onSuccess?.();
    },
  });
};
