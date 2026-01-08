import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

export interface MassDeleteResponse {
  message: string;
  deleted_count: number;
}

export const massDeleteSavedJobs = ({
  ids,
}: {
  ids: string[];
}): Promise<MassDeleteResponse> => {
  return api.delete("/jobs/saved/mass-delete", {
    data: { ids },
  });
};

type UseMassDeleteSavedJobsOptions = {
  mutationConfig?: MutationConfig<typeof massDeleteSavedJobs>;
};

export const useMassDeleteSavedJobs = ({
  mutationConfig,
}: UseMassDeleteSavedJobsOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
    ...mutationConfig,
    mutationFn: massDeleteSavedJobs,
  });
};
