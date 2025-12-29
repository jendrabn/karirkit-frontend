import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type {
  Job,
  JobType,
  WorkSystem,
  EducationLevel,
  JobStatus,
} from "@/types/job";

export interface Meta {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

export interface JobsListResponse {
  items: Job[];
  pagination: Meta;
}

export interface GetJobsParams {
  q?: string;
  company_id?: string;
  job_role_id?: string;
  city_id?: string;
  province_id?: string;
  job_type?: JobType;
  work_system?: WorkSystem;
  education_level?: EducationLevel;
  experience_min?: number;
  salary_min?: number;
  status?: JobStatus;
  page?: number;
  per_page?: number;
  sort?: "created_at" | "salary_min" | "experience_min";
  sort_order?: "asc" | "desc";
}

export const getJobs = (params?: GetJobsParams): Promise<JobsListResponse> => {
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
