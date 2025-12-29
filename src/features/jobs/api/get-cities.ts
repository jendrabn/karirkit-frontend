import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { City } from "@/types/job";

export interface CitiesListResponse {
  items: City[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
}

export interface GetCitiesParams {
  page?: number;
  per_page?: number;
  q?: string;
  province_id?: string;
}

export const getCities = (
  params?: GetCitiesParams
): Promise<CitiesListResponse> => {
  return api.get("/cities", {
    params,
  });
};

export const getCitiesQueryOptions = (params?: GetCitiesParams) => {
  return queryOptions({
    queryKey: ["cities", params],
    queryFn: () => getCities(params),
  });
};

type UseCitiesOptions = {
  params?: GetCitiesParams;
  queryConfig?: QueryConfig<typeof getCitiesQueryOptions>;
};

export const useCities = ({ params, queryConfig }: UseCitiesOptions = {}) => {
  return useQuery({
    ...getCitiesQueryOptions(params),
    ...queryConfig,
  });
};
