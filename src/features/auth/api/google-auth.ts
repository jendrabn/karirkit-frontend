import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const googleAuthInputSchema = z.object({
  id_token: z.string().min(1, "Google ID token is required"),
});

export type GoogleAuthInput = z.infer<typeof googleAuthInputSchema>;

export const googleAuth = (data: GoogleAuthInput) => {
  return api.post("/auth/google", data);
};

type UseGoogleAuthOptions = {
  mutationConfig?: MutationConfig<typeof googleAuth>;
};

export const useGoogleAuth = ({ mutationConfig }: UseGoogleAuthOptions) => {
  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      onSuccess?.(data, ...args);
    },
    onError: (error, ...args) => {
      onError?.(error, ...args);
    },
    ...restConfig,
    mutationFn: googleAuth,
  });
};
