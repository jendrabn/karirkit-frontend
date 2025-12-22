import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export type UploadBlogFileResponse = {
  path: string;
  original_name: string;
  size: number;
  mime_type: string;
};

export const uploadBlogFile = (file: File): Promise<UploadBlogFileResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/admin/blogs/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

type UseUploadBlogFileOptions = {
  mutationConfig?: MutationConfig<typeof uploadBlogFile>;
};

export const useUploadBlogFile = ({
  mutationConfig,
}: UseUploadBlogFileOptions = {}) => {
  return useMutation({
    mutationFn: uploadBlogFile,
    ...mutationConfig,
  });
};
