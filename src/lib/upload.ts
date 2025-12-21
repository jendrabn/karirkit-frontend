import { api } from "./api-client";
import type { MutationConfig } from "./react-query";
import { useMutation } from "@tanstack/react-query";

export interface UploadResponse {
  path: string;
  original_name: string;
  size: number;
  mime_type: string;
}

export const uploadFile = (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

type UseUploadFileOptions = {
  mutationConfig?: MutationConfig<typeof uploadFile>;
};

export const useUploadFile = ({
  mutationConfig,
}: UseUploadFileOptions = {}) => {
  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      onSuccess?.(data, ...args);
    },
    onError: (error, ...args) => {
      onError?.(error, ...args);
    },
    ...restConfig,
    mutationFn: uploadFile,
  });
};
