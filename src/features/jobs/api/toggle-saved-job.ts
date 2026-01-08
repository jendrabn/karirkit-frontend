import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Job } from "@/types/job";
import type { MutationConfig } from "@/lib/react-query";

export const toggleSavedJob = ({ id }: { id: string }): Promise<Job> => {
  return api.post("/jobs/saved/toggle", { id });
};

type UseToggleSavedJobOptions = {
  mutationConfig?: MutationConfig<typeof toggleSavedJob>;
};

export const useToggleSavedJob = ({
  mutationConfig,
}: UseToggleSavedJobOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
    ...mutationConfig,
    mutationFn: toggleSavedJob,
  });
};
