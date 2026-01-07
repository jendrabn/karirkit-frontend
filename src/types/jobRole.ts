import type { ListResponse } from "./api";

export interface JobRole {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  job_count?: number;
}

export type JobRoleListResponse = ListResponse<JobRole>;
