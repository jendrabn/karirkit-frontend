import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { AdminSubscription } from "@/types/subscription";

export const createAdminSubscriptionInputSchema = z.object({
  user_id: z.string().min(1, "User ID wajib diisi"),
  plan: z.enum(["pro", "max"], {
    message: "Plan wajib dipilih",
  }),
});

export type CreateAdminSubscriptionInput = z.infer<
  typeof createAdminSubscriptionInputSchema
>;

export const createAdminSubscription = (
  data: CreateAdminSubscriptionInput,
): Promise<AdminSubscription> => {
  return api.post("/admin/subscriptions", data);
};

type UseCreateAdminSubscriptionOptions = {
  mutationConfig?: MutationConfig<typeof createAdminSubscription>;
};

export const useCreateAdminSubscription = ({
  mutationConfig,
}: UseCreateAdminSubscriptionOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createAdminSubscription,
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
