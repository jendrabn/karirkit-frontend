import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { SubscriptionOrderResponse } from "@/types/subscription";

export const createSubscriptionOrderInputSchema = z.object({
  planId: z.enum(["pro", "max"], {
    message: "Plan harus Pro atau Max",
  }),
});

export type CreateSubscriptionOrderInput = z.infer<
  typeof createSubscriptionOrderInputSchema
>;

export const createSubscriptionOrder = (
  data: CreateSubscriptionOrderInput,
): Promise<SubscriptionOrderResponse> => {
  return api.post("/subscriptions/order", data);
};

type UseCreateSubscriptionOrderOptions = {
  mutationConfig?: MutationConfig<typeof createSubscriptionOrder>;
};

export const useCreateSubscriptionOrder = ({
  mutationConfig,
}: UseCreateSubscriptionOrderOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createSubscriptionOrder,
    onSuccess: async (...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-subscription"] }),
        queryClient.invalidateQueries({ queryKey: ["subscription-plans"] }),
      ]);
      await onSuccess?.(...args);
    },
    ...restConfig,
  });
};
