import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const updatePasswordInputSchema = z
  .object({
    current_password: z.string().min(1, "Password saat ini wajib diisi"),
    new_password: z.string().min(8, "Password baru minimal 8 karakter"),
    confirm_password: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirm_password"],
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordInputSchema>;

// Type for the API request (without confirm_password)
export type UpdatePasswordRequest = {
  current_password: string;
  new_password: string;
};

export const updatePassword = ({
  data,
}: {
  data: UpdatePasswordRequest;
}): Promise<{ message: string }> => {
  return api.put("/account/change-password", data);
};

type UseUpdatePasswordOptions = {
  mutationConfig?: MutationConfig<typeof updatePassword>;
};

export const useUpdatePassword = ({
  mutationConfig,
}: UseUpdatePasswordOptions) => {
  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      onSuccess?.(data, ...args);
    },
    onError: (error, ...args) => {
      onError?.(error, ...args);
    },
    ...restConfig,
    mutationFn: updatePassword,
  });
};
