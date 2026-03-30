import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { AdminSubscription } from "@/types/subscription";

export const getAdminSubscription = ({
  id,
}: {
  id: string;
}): Promise<AdminSubscription> => {
  return api.get(`/admin/subscriptions/${id}`);
};

export const getAdminSubscriptionQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["admin-subscriptions", id],
    queryFn: () => getAdminSubscription({ id }),
  });
};

type UseAdminSubscriptionOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getAdminSubscriptionQueryOptions>;
};

export const useAdminSubscription = ({
  id,
  queryConfig,
}: UseAdminSubscriptionOptions) => {
  return useQuery({
    ...getAdminSubscriptionQueryOptions(id),
    ...queryConfig,
  });
};
