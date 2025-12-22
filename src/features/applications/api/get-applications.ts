import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { Application, ApplicationsResponse } from "@/types/application";

export type GetApplicationsParams = {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?: "date" | "created_at" | "updated_at" | "company_name" | "position" | "status" | "result_status";
  status?: string;
  result_status?: string;
  job_type?: string;
  work_system?: string;
  date_from?: string;
  date_to?: string;
  location?: string;
};

export const getApplications = (
  params?: GetApplicationsParams
): Promise<ApplicationsResponse> => {
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
