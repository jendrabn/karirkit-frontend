import { z } from "zod";
import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { Job } from "@/types/job";
import { createJobInputSchema } from "./create-job";
export { createJobInputSchema as updateJobInputSchema };

export type UpdateJobInput = z.infer<typeof createJobInputSchema>;

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
        queryKey: ["jobs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["job", data.id],
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateJob,
  });
};
