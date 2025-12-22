import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { PublicUser, PublicPortfolio } from "./get-public-portfolios";

export type PublicPortfolioDetailResponse = {
  user: PublicUser;
  portfolio: PublicPortfolio;
};

export const getPublicPortfolio = (
  username: string,
  id: string
): Promise<PublicPortfolioDetailResponse> => {
  return api.get(`/u/@${username}/${id}`);
};

export const getPublicPortfolioQueryOptions = (username: string, id: string) => {
  return queryOptions({
    queryKey: ["public-portfolio", username, id],
    queryFn: () => getPublicPortfolio(username, id),
  });
};

type UsePublicPortfolioOptions = {
  username: string;
  id: string;
  queryConfig?: QueryConfig<typeof getPublicPortfolioQueryOptions>;
};

export const usePublicPortfolio = ({
  username,
  id,
  queryConfig,
}: UsePublicPortfolioOptions) => {
  return useQuery({
    ...getPublicPortfolioQueryOptions(username, id),
    ...queryConfig,
  });
};
