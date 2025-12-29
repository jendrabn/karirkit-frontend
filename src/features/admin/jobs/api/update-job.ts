import { z } from "zod";
import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { Job } from "@/types/job";
import { getJobsQueryOptions } from "./get-jobs";
import { getJobQueryOptions } from "./get-job";
import { createJobInputSchema } from "./create-job";

export const updateJobInputSchema = createJobInputSchema.partial();

export type UpdateJobInput = z.infer<typeof updateJobInputSchema>;

export const updateJob = ({
  data,
  id,
}: {
  data: UpdateJobInput;
  id: string;
}): Promise<Job> => {
  return api.put(`/admin/jobs/${id}`, data);
};

type UseUpdateJobOptions = {
  mutationConfig?: MutationConfig<typeof updateJob>;
};

export const useUpdateJob = ({ mutationConfig }: UseUpdateJobOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getJobsQueryOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getJobQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateJob,
  });
};
