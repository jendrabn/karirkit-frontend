import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const facebookAuthInputSchema = z.object({
  access_token: z.string().min(1, "Facebook access token is required"),
});

export type FacebookAuthInput = z.infer<typeof facebookAuthInputSchema>;

export const facebookAuth = (data: FacebookAuthInput) => {
  return api.post("/auth/facebook", data, {
    skipGeneralErrorToast: true,
  });
};

type UseFacebookAuthOptions = {
  mutationConfig?: MutationConfig<typeof facebookAuth>;
};

export const useFacebookAuth = ({
  mutationConfig,
}: UseFacebookAuthOptions) => {
  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      onSuccess?.(data, ...args);
    },
    onError: (error, ...args) => {
      onError?.(error, ...args);
    },
    ...restConfig,
    mutationFn: facebookAuth,
  });
};
