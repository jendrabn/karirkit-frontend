import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export const massDeleteCVs = ({ ids }: { ids: string[] }) => {
  return api.delete(`/cvs/mass-delete`, {
    data: { ids },
  });
};

type UseMassDeleteCVsOptions = {
  mutationConfig?: MutationConfig<typeof massDeleteCVs>;
};

export const useMassDeleteCVs = ({
  mutationConfig,
}: UseMassDeleteCVsOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["cvs"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: massDeleteCVs,
  });
};
