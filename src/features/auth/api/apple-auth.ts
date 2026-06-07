import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const appleAuthInputSchema = z.object({
  id_token: z.string().min(1, "Apple identity token is required"),
  name: z.string().min(1).optional(),
});

export type AppleAuthInput = z.infer<typeof appleAuthInputSchema>;

export const appleAuth = (data: AppleAuthInput) => {
  return api.post("/auth/apple", data, {
    skipGeneralErrorToast: true,
  });
};

type UseAppleAuthOptions = {
  mutationConfig?: MutationConfig<typeof appleAuth>;
};

export const useAppleAuth = ({ mutationConfig }: UseAppleAuthOptions) => {
  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      onSuccess?.(data, ...args);
    },
    onError: (error, ...args) => {
      onError?.(error, ...args);
    },
    ...restConfig,
    mutationFn: appleAuth,
  });
};
