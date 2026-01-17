import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { User } from "@/types/user";
export type { User };
import type { ListResponse } from "@/types/api";

export type GetUsersParams = {
  page?: number;
  per_page?: number;
  q?: string;
  sort_order?: "asc" | "desc";
  sort_by?:
    | "created_at"
    | "updated_at"
    | "name"
    | "email"
    | "role"
    | "status"
    | "document_storage_used"
    | "download_total_count";
  role?: "user" | "admin";
  status?: "active" | "suspended" | "banned";
  gender?: "male" | "female";
  email_verified?: "true" | "false";
  suspended?: "true" | "false";
  created_at_from?: string;
  created_at_to?: string;
  daily_download_limit_from?: number;
  daily_download_limit_to?: number;
  document_storage_used_from?: number;
  document_storage_used_to?: number;
  download_total_count_from?: number;
  download_total_count_to?: number;
};

export const getUsers = (
  params?: GetUsersParams
): Promise<ListResponse<User>> => {
  return api.get("/admin/users", {
    params,
  });
};

export const getUsersQueryOptions = (params?: GetUsersParams) => {
  return queryOptions({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
};

type UseUsersOptions = {
  params?: GetUsersParams;
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

export const useUsers = ({ params, queryConfig }: UseUsersOptions = {}) => {
  return useQuery({
    ...getUsersQueryOptions(params),
    ...queryConfig,
  });
};
