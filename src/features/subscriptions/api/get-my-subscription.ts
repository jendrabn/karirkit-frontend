import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { MySubscription } from "@/types/subscription";

export const getMySubscription = (): Promise<MySubscription> => {
  return api.get("/subscriptions/my", {
    skipGeneralErrorToast: true,
  });
};

export const getMySubscriptionQueryOptions = () => {
  return queryOptions({
    queryKey: ["my-subscription"],
    queryFn: getMySubscription,
  });
};

type UseMySubscriptionOptions = {
  queryConfig?: QueryConfig<typeof getMySubscriptionQueryOptions>;
};

export const useMySubscription = ({
  queryConfig,
}: UseMySubscriptionOptions = {}) => {
  return useQuery({
    ...getMySubscriptionQueryOptions(),
    ...queryConfig,
  });
};
