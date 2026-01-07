import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { User } from "@/types/user";

export const updateUserDownloadLimitInputSchema = z.object({
  daily_download_limit: z.coerce.number().min(0).max(1000),
});

export type UpdateUserDownloadLimitInput = z.infer<
  typeof updateUserDownloadLimitInputSchema
>;

export const updateUserDownloadLimit = ({
  id,
  data,
}: {
  id: string;
  data: UpdateUserDownloadLimitInput;
}): Promise<User> => {
  return api.patch(`/admin/users/${id}/daily-download-limit`, data);
};

type UseUpdateUserDownloadLimitOptions = {
  mutationConfig?: MutationConfig<typeof updateUserDownloadLimit>;
};

export const useUpdateUserDownloadLimit = ({
  mutationConfig,
}: UseUpdateUserDownloadLimitOptions = {}) => {
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
    mutationFn: updateUserDownloadLimit,
  });
};
