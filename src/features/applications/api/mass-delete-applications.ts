import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export const massDeleteApplications = ({ ids }: { ids: string[] }) => {
  return api.delete(`/applications/mass-delete`, {
    data: { ids },
  });
};

type UseMassDeleteApplicationsOptions = {
  mutationConfig?: MutationConfig<typeof massDeleteApplications>;
};

export const useMassDeleteApplications = ({
  mutationConfig,
}: UseMassDeleteApplicationsOptions = {}) => {
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
    mutationFn: massDeleteApplications,
  });
};
