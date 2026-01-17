import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { EmployeeSize, CompanyListResponse } from "@/types/company";

export interface GetCompaniesParams {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?: "created_at" | "updated_at" | "name" | "employee_size" | "job_count";
  business_sector?: string;
  employee_size?: EmployeeSize;
  job_count_from?: number;
  job_count_to?: number;
  created_at_from?: string;
  created_at_to?: string;
}

export const getCompanies = (
  params?: GetCompaniesParams
): Promise<CompanyListResponse> => {
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
