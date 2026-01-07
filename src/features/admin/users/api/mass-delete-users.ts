import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { MessageResponse } from "@/types/api";

export const massDeleteUsers = ({
  ids,
}: {
  ids: string[];
}): Promise<MessageResponse> => {
  return api.delete(`/admin/users/mass-delete`, {
    data: { ids },
  });
};

type UseMassDeleteUsersOptions = {
  mutationConfig?: MutationConfig<typeof massDeleteUsers>;
};

export const useMassDeleteUsers = ({
  mutationConfig,
}: UseMassDeleteUsersOptions = {}) => {
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
    mutationFn: massDeleteUsers,
  });
};
