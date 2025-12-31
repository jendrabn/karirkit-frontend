import { z } from "zod";
import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { JobRole } from "@/types/job";
import { getJobRolesQueryOptions } from "./get-job-roles";

export const createJobRoleInputSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
});

export type CreateJobRoleInput = z.infer<typeof createJobRoleInputSchema>;

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
        queryKey: getJobRolesQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createJobRole,
  });
};
