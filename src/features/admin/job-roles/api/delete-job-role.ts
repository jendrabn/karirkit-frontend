import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getJobRolesQueryOptions } from "./get-job-roles";

export const deleteJobRole = (id: string): Promise<null> => {
  return api.delete(`/admin/job-roles/${id}`);
};

type UseDeleteJobRoleOptions = {
  mutationConfig?: MutationConfig<typeof deleteJobRole>;
};

export const useDeleteJobRole = ({
  mutationConfig,
}: UseDeleteJobRoleOptions = {}) => {
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
    mutationFn: deleteJobRole,
  });
};
