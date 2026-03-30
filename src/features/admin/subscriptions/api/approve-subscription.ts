import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { AdminSubscription } from "@/types/subscription";

export const approveAdminSubscription = ({
  id,
}: {
  id: string;
}): Promise<AdminSubscription> => {
  return api.patch(`/admin/subscriptions/${id}/approve`);
};

type UseApproveAdminSubscriptionOptions = {
  mutationConfig?: MutationConfig<typeof approveAdminSubscription>;
};

export const useApproveAdminSubscription = ({
  mutationConfig,
}: UseApproveAdminSubscriptionOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: approveAdminSubscription,
    onSuccess: async (data, ...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] }),
        queryClient.invalidateQueries({
          queryKey: ["admin-subscriptions", data.id],
        }),
        queryClient.invalidateQueries({ queryKey: ["users"] }),
      ]);
      await onSuccess?.(data, ...args);
    },
    ...restConfig,
  });
};
