import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export const deletePortfolio = (id: string): Promise<void> => {
  return api.delete(`/portfolios/${id}`);
};

type UseDeletePortfolioOptions = {
  mutationConfig?: MutationConfig<typeof deletePortfolio>;
};

export const useDeletePortfolio = ({
  mutationConfig,
}: UseDeletePortfolioOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deletePortfolio,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
