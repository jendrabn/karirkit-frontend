import { api } from "./api-client";
import type { MutationConfig } from "./react-query";
import { useMutation } from "@tanstack/react-query";

export interface UploadData {
  path: string;
  original_name: string;
  size: number;
  mime_type: string;
}

export type UploadInput =
  | File
  | { file: File; quality?: number; webp?: boolean; format?: string };

export const uploadFile = (input: UploadInput): Promise<UploadData> => {
  const formData = new FormData();
  let file: File;
  const params = new URLSearchParams();

  if (input instanceof File) {
    file = input;
  } else {
    file = input.file;
    if (input.quality !== undefined) {
      params.append("quality", input.quality.toString());
    }
    if (input.webp !== undefined) {
      params.append("webp", input.webp.toString());
    }
    if (input.format !== undefined) {
      params.append("format", input.format);
    }
  }

  formData.append("file", file);

  const queryString = params.toString();
  const url = queryString ? `/uploads?${queryString}` : "/uploads";

  return api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }) as Promise<UploadData>;
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
