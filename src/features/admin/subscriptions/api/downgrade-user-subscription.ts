import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { AdminSubscription } from "@/types/subscription";

export const downgradeAdminSubscriptionUser = ({
  userId,
}: {
  userId: string;
}): Promise<AdminSubscription> => {
  return api.patch(`/admin/subscriptions/users/${userId}/downgrade`);
};

type UseDowngradeAdminSubscriptionUserOptions = {
  mutationConfig?: MutationConfig<typeof downgradeAdminSubscriptionUser>;
};

export const useDowngradeAdminSubscriptionUser = ({
  mutationConfig,
}: UseDowngradeAdminSubscriptionUserOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: downgradeAdminSubscriptionUser,
    onSuccess: async (...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] }),
        queryClient.invalidateQueries({ queryKey: ["users"] }),
      ]);
      await onSuccess?.(...args);
    },
    ...restConfig,
  });
};
