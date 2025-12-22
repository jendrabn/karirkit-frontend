import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { Application } from "@/types/application";

export const duplicateApplication = ({ id }: { id: string }): Promise<Application> => {
  return api.post(`/applications/${id}/duplicate`);
};

type UseDuplicateApplicationOptions = {
  mutationConfig?: MutationConfig<typeof duplicateApplication>;
};

export const useDuplicateApplication = ({
  mutationConfig,
}: UseDuplicateApplicationOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: duplicateApplication,
  });
};
