import { api } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import type { User } from "./get-users";

export const getUser = ({ id }: { id: string }): Promise<User> => {
  return api.get(`/admin/users/${id}`);
};

export const getUserQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["users", id],
    queryFn: () => getUser({ id }),
  });
};

type UseUserOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getUserQueryOptions>;
};

export const useUser = ({ id, queryConfig }: UseUserOptions) => {
  return useQuery({
    ...getUserQueryOptions(id),
    ...queryConfig,
  });
};
