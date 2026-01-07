import { z } from "zod";
import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { JobRole } from "@/types/jobRole";

export const jobRoleSchema = z.object({
  name: z.string().min(1, "Nama role wajib diisi"),
});

export type JobRoleFormData = z.infer<typeof jobRoleSchema>;
export type CreateJobRoleInput = JobRoleFormData;

export const createJobRole = (data: CreateJobRoleInput): Promise<JobRole> => {
  return api.post("/admin/job-roles", data);
};

type UseCreateJobRoleOptions = {
  mutationConfig?: MutationConfig<typeof createJobRole>;
};

export const useCreateJobRole = ({
  mutationConfig,
}: UseCreateJobRoleOptions = {}) => {
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
    mutationFn: createJobRole,
  });
};
