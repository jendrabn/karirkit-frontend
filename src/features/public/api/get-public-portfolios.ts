import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { Portfolio } from "@/features/portfolios/api/get-portfolios";

export type PublicUser = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  headline: string;
};

export type PublicPortfolio = Portfolio;

export type PublicPortfoliosResponse = {
  user: PublicUser;
  portfolios: PublicPortfolio[];
};

export const getPublicPortfolios = (
  username: string
): Promise<PublicPortfoliosResponse> => {
  return api.get(`/u/@${username}`);
};

export const getPublicPortfoliosQueryOptions = (username: string) => {
  return queryOptions({
    queryKey: ["public-portfolios", username],
    queryFn: () => getPublicPortfolios(username),
  });
};

type UsePublicPortfoliosOptions = {
  username: string;
  queryConfig?: QueryConfig<typeof getPublicPortfoliosQueryOptions>;
};

export const usePublicPortfolios = ({
  username,
  queryConfig,
}: UsePublicPortfoliosOptions) => {
  return useQuery({
    ...getPublicPortfoliosQueryOptions(username),
    ...queryConfig,
  });
};
