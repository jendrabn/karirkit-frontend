import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { JobRole } from "@/types/job";
import { getJobRolesQueryOptions } from "./get-job-roles";
import { getJobRoleQueryOptions } from "./get-job-role";
import { createJobRoleInputSchema } from "./create-job-role";

export const updateJobRoleInputSchema = createJobRoleInputSchema.partial();

export type UpdateJobRoleInput = {
  name: string;
};

export const updateJobRole = ({
  data,
  id,
}: {
  data: UpdateJobRoleInput;
  id: string;
}): Promise<JobRole> => {
  return api.put(`/admin/job-roles/${id}`, data);
};

type UseUpdateJobRoleOptions = {
  mutationConfig?: MutationConfig<typeof updateJobRole>;
};

export const useUpdateJobRole = ({
  mutationConfig,
}: UseUpdateJobRoleOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getJobRolesQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getJobRoleQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateJobRole,
  });
};
