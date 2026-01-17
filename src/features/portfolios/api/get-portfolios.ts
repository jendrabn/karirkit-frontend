import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";

export type Portfolio = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  sort_description: string;
  description: string;
  role_title: string;
  project_type: "work" | "freelance" | "personal" | "academic";
  industry: string;
  month: number;
  year: number;
  live_url: string;
  repo_url: string;
  cover: string;
  created_at: string;
  updated_at: string;
  medias: PortfolioMedia[];
  tools: PortfolioTool[];
};

export type PortfolioMedia = {
  id: string;
  portfolio_id: string;
  path: string;
  caption: string;
};

export type PortfolioTool = {
  id: string;
  portfolio_id: string;
  name: string;
};

export type PortfoliosResponse = {
  items: Portfolio[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
};

export type GetPortfoliosParams = {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?:
    | "created_at"
    | "updated_at"
    | "year"
    | "month"
    | "title"
    | "industry";
  project_type?: "work" | "freelance" | "personal" | "academic";
  industry?: string;
  year?: number;
  month?: number;
  year_from?: number;
  year_to?: number;
  month_from?: number;
  month_to?: number;
  created_at_from?: string;
  created_at_to?: string;
  tools_name?: string;
};

export const getPortfolios = (
  params?: GetPortfoliosParams
): Promise<PortfoliosResponse> => {
  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== null && value !== "" && value !== undefined
        )
      )
    : undefined;

  return api.get("/portfolios", {
    params: filteredParams,
  });
};

export const getPortfoliosQueryOptions = (params?: GetPortfoliosParams) => {
  return queryOptions({
    queryKey: ["portfolios", params],
    queryFn: () => getPortfolios(params),
  });
};

type UsePortfoliosOptions = {
  params?: GetPortfoliosParams;
  queryConfig?: QueryConfig<typeof getPortfoliosQueryOptions>;
};

export const usePortfolios = ({
  params,
  queryConfig,
}: UsePortfoliosOptions = {}) => {
  return useQuery({
    ...getPortfoliosQueryOptions(params),
    ...queryConfig,
  });
};
