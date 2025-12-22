import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { Portfolio } from "./get-portfolios";

export type PortfolioResponse = Portfolio;

export const getPortfolio = (id: string): Promise<PortfolioResponse> => {
  return api.get(`/portfolios/${id}`);
};

export const getPortfolioQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["portfolio", id],
    queryFn: () => getPortfolio(id),
  });
};

type UsePortfolioOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getPortfolioQueryOptions>;
};

export const usePortfolio = ({ id, queryConfig }: UsePortfolioOptions) => {
  return useQuery({
    ...getPortfolioQueryOptions(id),
    ...queryConfig,
  });
};
