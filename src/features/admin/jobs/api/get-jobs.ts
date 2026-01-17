import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type {
  JobType,
  WorkSystem,
  EducationLevel,
  JobStatus,
  JobListResponse,
} from "@/types/job";

export interface GetJobsParams {
  q?: string;
  page?: number;
  per_page?: number;
  sort_by?:
    | "created_at"
    | "updated_at"
    | "title"
    | "company_name"
    | "status"
    | "salary_max"
    | "expiration_date";
  sort_order?: "asc" | "desc";
  status?: JobStatus;
  job_type?: JobType | string;
  work_system?: WorkSystem | string;
  education_level?: EducationLevel;
  company_id?: string;
  job_role_id?: string;
  city_id?: string;
  salary_from?: number;
  salary_to?: number;
  years_of_experience_from?: number;
  years_of_experience_to?: number;
  expiration_date_from?: string;
  expiration_date_to?: string;
  created_at_from?: string;
  created_at_to?: string;
}

export const getJobs = (params?: GetJobsParams): Promise<JobListResponse> => {
  return api.get("/admin/jobs", {
    params,
  });
};

export const getJobsQueryOptions = (params?: GetJobsParams) => {
  return queryOptions({
    queryKey: ["jobs", params],
    queryFn: () => getJobs(params),
  });
};

type UseJobsOptions = {
  params?: GetJobsParams;
  queryConfig?: QueryConfig<typeof getJobsQueryOptions>;
};

export const useJobs = ({ params, queryConfig }: UseJobsOptions = {}) => {
  return useQuery({
    ...getJobsQueryOptions(params),
    ...queryConfig,
  });
};
