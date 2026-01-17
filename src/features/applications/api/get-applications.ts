import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApplicationListResponse } from "@/types/application";

export type GetApplicationsParams = {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?:
    | "date"
    | "created_at"
    | "updated_at"
    | "company_name"
    | "position"
    | "follow_up_date"
    | "salary_max";
  status?: string;
  result_status?: string;
  job_type?: string;
  work_system?: string;
  date_from?: string;
  date_to?: string;
  follow_up_date_from?: string;
  follow_up_date_to?: string;
  follow_up_date_has?: "true" | "false";
  follow_up_overdue?: "true" | "false";
  location?: string;
  company_name?: string;
  job_source?: string;
  salary_from?: number;
  salary_to?: number;
};

export const getApplications = (
  params?: GetApplicationsParams
): Promise<ApplicationListResponse> => {
  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== null && value !== "" && value !== undefined
        )
      )
    : undefined;

  return api.get("/applications", {
    params: filteredParams,
  });
};

export const getApplicationsQueryOptions = (params?: GetApplicationsParams) => {
  return queryOptions({
    queryKey: ["applications", params],
    queryFn: () => getApplications(params),
  });
};

type UseApplicationsOptions = {
  params?: GetApplicationsParams;
  queryConfig?: QueryConfig<typeof getApplicationsQueryOptions>;
};

export const useApplications = ({
  params,
  queryConfig,
}: UseApplicationsOptions = {}) => {
  return useQuery({
    ...getApplicationsQueryOptions(params),
    ...queryConfig,
  });
};
