import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export const massDeletePortfolios = ({ ids }: { ids: string[] }) => {
  return api.delete(`/portfolios/mass-delete`, {
    data: { ids },
  });
};

type UseMassDeletePortfoliosOptions = {
  mutationConfig?: MutationConfig<typeof massDeletePortfolios>;
};

export const useMassDeletePortfolios = ({
  mutationConfig,
}: UseMassDeletePortfoliosOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["portfolios"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: massDeletePortfolios,
  });
};
