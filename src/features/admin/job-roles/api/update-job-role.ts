import { z } from "zod";
import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { JobRole } from "@/types/jobRole";
import { jobRoleSchema } from "./create-job-role";

export type UpdateJobRoleInput = z.infer<typeof jobRoleSchema>;

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
        queryKey: ["job-roles"],
      });
      queryClient.invalidateQueries({
        queryKey: ["job-role", data.id],
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateJobRole,
  });
};
