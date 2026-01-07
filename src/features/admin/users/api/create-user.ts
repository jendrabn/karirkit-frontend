import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import type { User } from "@/types/user";

export const DEFAULT_DOCUMENT_STORAGE_LIMIT = 100 * 1024 * 1024;

export const createUserInputSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  username: z.string().min(1, "Username wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  phone: z.string().optional().nullable(),
  role: z.enum(["user", "admin"]),
  avatar: z.string().optional().nullable(),
  daily_download_limit: z.coerce
    .number()
    .min(0)
    .max(1000)
    .optional()
    .default(10),
  document_storage_limit: z.coerce
    .number()
    .min(0)
    .optional()
    .default(DEFAULT_DOCUMENT_STORAGE_LIMIT),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createUser = (data: CreateUserInput): Promise<User> => {
  return api.post("/admin/users", data);
};

type UseCreateUserOptions = {
  mutationConfig?: MutationConfig<typeof createUser>;
};

export const useCreateUser = ({
  mutationConfig,
}: UseCreateUserOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createUser,
  });
};
