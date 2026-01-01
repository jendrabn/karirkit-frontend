import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import type { User } from "./get-users";

export const updateUserStatusInputSchema = z.object({
  status: z.enum(["active", "suspended", "banned"]),
  status_reason: z.string().optional(),
  suspended_until: z.string().optional(),
});

export type UpdateUserStatusInput = z.infer<
  typeof updateUserStatusInputSchema
>;

export const updateUserStatus = ({
  id,
  data,
}: {
  id: string;
  data: UpdateUserStatusInput;
}): Promise<User> => {
  return api.patch(`/admin/users/${id}/status`, data);
};

type UseUpdateUserStatusOptions = {
  mutationConfig?: MutationConfig<typeof updateUserStatus>;
};

export const useUpdateUserStatus = ({
  mutationConfig,
}: UseUpdateUserStatusOptions = {}) => {
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
    mutationFn: updateUserStatus,
  });
};
