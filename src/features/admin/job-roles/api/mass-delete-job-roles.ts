import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getJobRolesQueryOptions } from "./get-job-roles";

export interface MassDeleteJobRolesResponse {
  message: string;
  deleted_count: number;
}

export const massDeleteJobRoles = (
  ids: string[]
): Promise<MassDeleteJobRolesResponse> => {
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
        queryKey: getJobRolesQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: massDeleteJobRoles,
  });
};
