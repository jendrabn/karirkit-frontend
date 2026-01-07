import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { CV } from "./get-cvs";

export const cvVisibilitySchema = z.object({
  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug hanya boleh berisi huruf kecil, angka, dan strip"
    )
    .optional(),
  visibility: z.enum(["public", "private", "unlisted"]).optional(),
});

export type UpdateCvVisibilityInput = z.infer<typeof cvVisibilitySchema>;

export const updateCvVisibility = ({
  id,
  data,
}: {
  id: string;
  data: UpdateCvVisibilityInput;
}): Promise<CV> => {
  return api.patch(`/cvs/${id}/visibility`, data);
};

type UseUpdateCvVisibilityOptions = {
  mutationConfig?: MutationConfig<typeof updateCvVisibility>;
};

export const useUpdateCvVisibility = ({
  mutationConfig,
}: UseUpdateCvVisibilityOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateCvVisibility,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ["cvs"] });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
  });
};
