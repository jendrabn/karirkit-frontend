import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { MessageResponse } from "@/types/api";

export const massDeleteJobRoles = (ids: string[]): Promise<MessageResponse> => {
  return api.delete("/admin/job-roles/mass-delete", {
    data: { ids },
  });
};

type UseMassDeleteJobRolesOptions = {
  mutationConfig?: MutationConfig<typeof massDeleteJobRoles>;
};

export const useMassDeleteJobRoles = ({
  mutationConfig,
}: UseMassDeleteJobRolesOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["job-roles"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: massDeleteJobRoles,
  });
};
