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
    | "username"
    | "email"
    | "role";
  role?: "user" | "admin";
  created_from?: string;
  created_to?: string;
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
