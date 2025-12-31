import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Portfolio } from "./get-portfolios";

export type UpdatePortfolioInput = {
  title: string;
  sort_description: string;
  description: string;
  role_title: string;
  project_type: "work" | "freelance" | "personal" | "academic";
  industry: string;
  month: number;
  year: number;
  live_url?: string;
  repo_url?: string;
  cover?: string;
  tools?: string[];
  medias?: {
    path: string;
    caption: string;
  }[];
};

export type UpdatePortfolioResponse = Portfolio;

export const updatePortfolio = ({
  id,
  data,
}: {
  id: string;
  data: UpdatePortfolioInput;
}): Promise<UpdatePortfolioResponse> => {
  return api.put(`/portfolios/${id}`, data);
};

type UseUpdatePortfolioOptions = {
  mutationConfig?: MutationConfig<typeof updatePortfolio>;
};

export const useUpdatePortfolio = ({
  mutationConfig,
}: UseUpdatePortfolioOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updatePortfolio,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio", args[1].id] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
