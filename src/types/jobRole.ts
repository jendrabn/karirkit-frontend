export interface JobRole {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface JobRolePagination {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

export interface JobRolesResponse {
  data: {
    items: JobRole[];
    pagination: JobRolePagination;
  };
}
