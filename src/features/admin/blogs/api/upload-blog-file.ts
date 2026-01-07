import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { UploadData } from "@/lib/upload";

export const uploadBlogFile = (file: File): Promise<UploadData> => {
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
