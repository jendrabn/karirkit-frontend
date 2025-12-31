import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Portfolio } from "./get-portfolios";

export type CreatePortfolioInput = {
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

export type CreatePortfolioResponse = Portfolio;

export const createPortfolio = (
  data: CreatePortfolioInput
): Promise<CreatePortfolioResponse> => {
  return api.post("/portfolios", data);
};

type UseCreatePortfolioOptions = {
  mutationConfig?: MutationConfig<typeof createPortfolio>;
};

export const useCreatePortfolio = ({
  mutationConfig,
}: UseCreatePortfolioOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createPortfolio,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
