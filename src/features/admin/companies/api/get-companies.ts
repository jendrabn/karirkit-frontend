import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { Company, EmployeeSize } from "@/types/company";

export interface Meta {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

export interface CompaniesListResponse {
  items: Company[];
  pagination: Meta;
}

export interface GetCompaniesParams {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?: "created_at" | "updated_at" | "name";
  business_sector?: string;
  employee_size?: EmployeeSize;
}

export const getCompanies = (
  params?: GetCompaniesParams
): Promise<CompaniesListResponse> => {
  return api.get("/admin/companies", {
    params,
  });
};

export const getCompaniesQueryOptions = (params?: GetCompaniesParams) => {
  return queryOptions({
    queryKey: ["companies", params],
    queryFn: () => getCompanies(params),
  });
};

type UseCompaniesOptions = {
  params?: GetCompaniesParams;
  queryConfig?: QueryConfig<typeof getCompaniesQueryOptions>;
};

export const useCompanies = ({
  params,
  queryConfig,
}: UseCompaniesOptions = {}) => {
  return useQuery({
    ...getCompaniesQueryOptions(params),
    ...queryConfig,
  });
};
