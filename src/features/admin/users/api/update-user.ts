import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import type { User } from "@/types/user";

export const updateUserInputSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  username: z.string().min(1, "Username wajib diisi"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().optional().nullable(),
  role: z.enum(["user", "admin"]),
  avatar: z.string().optional().nullable(),
  status: z.enum(["active", "suspended", "banned"]).optional(),
  status_reason: z.string().optional().nullable(),
  suspended_until: z.string().optional().nullable(),
  daily_download_limit: z.coerce.number().min(0).max(1000).optional(),
  document_storage_limit: z.coerce.number().min(0).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export const updateUser = ({
  id,
  data,
}: {
  id: string;
  data: Partial<UpdateUserInput>;
}): Promise<User> => {
  return api.put(`/admin/users/${id}`, data);
};

type UseUpdateUserOptions = {
  mutationConfig?: MutationConfig<typeof updateUser>;
};

export const useUpdateUser = ({
  mutationConfig,
}: UseUpdateUserOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", data.id],
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateUser,
  });
};
