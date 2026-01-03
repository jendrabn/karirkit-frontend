import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { SOCIAL_PLATFORM_VALUES } from "@/types/social";
import type { User } from "@/types/api";

const socialLinkField = z.object({
  platform: z.enum(SOCIAL_PLATFORM_VALUES),
  url: z.string().url("URL tidak valid"),
});

export const updateProfileInputSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  gender: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(["male", "female", "other"]).optional()
  ),
  birth_date: z.string().optional(),
  social_links: z.array(socialLinkField).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;

export const updateProfile = ({
  data,
}: {
  data: UpdateProfileInput;
}): Promise<User> => {
  return api.put("/account/me", data);
};

type UseUpdateProfileOptions = {
  mutationConfig?: MutationConfig<typeof updateProfile>;
};

export const useUpdateProfile = ({
  mutationConfig,
}: UseUpdateProfileOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.refetchQueries({ queryKey: ["user"] });

      onSuccess?.(data, ...args);
    },
    onError: (error, ...args) => {
      onError?.(error, ...args);
    },
    ...restConfig,
    mutationFn: updateProfile,
  });
};
