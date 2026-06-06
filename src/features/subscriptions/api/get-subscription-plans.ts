import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { SubscriptionPlansResponse } from "@/types/subscription";

export const getSubscriptionPlans = (): Promise<SubscriptionPlansResponse> => {
  return api.get("/subscriptions/plans");
};

export const getSubscriptionPlansQueryOptions = () => {
  return queryOptions({
    queryKey: ["subscription-plans"],
    queryFn: getSubscriptionPlans,
  });
};

type UseSubscriptionPlansOptions = {
  queryConfig?: QueryConfig<typeof getSubscriptionPlansQueryOptions>;
};

export const useSubscriptionPlans = ({
  queryConfig,
}: UseSubscriptionPlansOptions = {}) => {
  return useQuery({
    ...getSubscriptionPlansQueryOptions(),
    ...queryConfig,
  });
};
