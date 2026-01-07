import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { User } from "@/types/user";

export const updateUserStorageLimitInputSchema = z.object({
  document_storage_limit: z.coerce.number().min(0),
});

export type UpdateUserStorageLimitInput = z.infer<
  typeof updateUserStorageLimitInputSchema
>;

export const updateUserStorageLimit = ({
  id,
  data,
}: {
  id: string;
  data: UpdateUserStorageLimitInput;
}): Promise<User> => {
  return api.patch(`/admin/users/${id}/storage-download-limit`, data);
};

type UseUpdateUserStorageLimitOptions = {
  mutationConfig?: MutationConfig<typeof updateUserStorageLimit>;
};

export const useUpdateUserStorageLimit = ({
  mutationConfig,
}: UseUpdateUserStorageLimitOptions = {}) => {
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
    mutationFn: updateUserStorageLimit,
  });
};
