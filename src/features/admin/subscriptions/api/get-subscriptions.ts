import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type {
  AdminSubscriptionsResponse,
  SubscriptionPlanId,
  SubscriptionStatus,
} from "@/types/subscription";

export type AdminSubscriptionSortField =
  | "created_at"
  | "updated_at"
  | "paid_at"
  | "expires_at"
  | "amount";

export type GetAdminSubscriptionsParams = {
  page?: number;
  per_page?: number;
  q?: string;
  sort_by?: AdminSubscriptionSortField | string;
  sort_order?: "asc" | "desc";
  plan?: SubscriptionPlanId;
  status?: SubscriptionStatus;
};

const ADMIN_SUBSCRIPTION_SORT_FIELDS: AdminSubscriptionSortField[] = [
  "created_at",
  "updated_at",
  "paid_at",
  "expires_at",
  "amount",
];

export const normalizeAdminSubscriptionSortField = (
  sortBy?: string,
): AdminSubscriptionSortField | undefined => {
  if (!sortBy) {
    return undefined;
  }

  if (
    ADMIN_SUBSCRIPTION_SORT_FIELDS.includes(
      sortBy as AdminSubscriptionSortField,
    )
  ) {
    return sortBy as AdminSubscriptionSortField;
  }

  return undefined;
};

export const getAdminSubscriptions = (
  params?: GetAdminSubscriptionsParams,
): Promise<AdminSubscriptionsResponse> => {
  const normalizedSortBy = normalizeAdminSubscriptionSortField(params?.sort_by);

  return api.get("/admin/subscriptions", {
    params: {
      ...params,
      sort_by: normalizedSortBy,
    },
  });
};

export const getAdminSubscriptionsQueryOptions = (
  params?: GetAdminSubscriptionsParams,
) => {
  return queryOptions({
    queryKey: ["admin-subscriptions", params],
    queryFn: () => getAdminSubscriptions(params),
  });
};

type UseAdminSubscriptionsOptions = {
  params?: GetAdminSubscriptionsParams;
  queryConfig?: QueryConfig<typeof getAdminSubscriptionsQueryOptions>;
};

export const useAdminSubscriptions = ({
  params,
  queryConfig,
}: UseAdminSubscriptionsOptions = {}) => {
  return useQuery({
    ...getAdminSubscriptionsQueryOptions(params),
    ...queryConfig,
  });
};
