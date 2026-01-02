import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type {
  Document,
  DocumentCompressionLevel,
  DocumentType,
} from "@/types/document";

export type UploadDocumentInput = {
  type: DocumentType;
  compression?: DocumentCompressionLevel;
  merge?: boolean;
  name?: string;
  file?: File;
  files?: File[];
};

export const uploadDocument = ({
  file,
  files,
  type,
  compression,
  merge,
  name,
}: UploadDocumentInput): Promise<Document | Document[]> => {
  const formData = new FormData();
  formData.append("type", type);
  if (name) {
    formData.append("name", name);
  }
  if (files && files.length > 0) {
    files.forEach((item) => {
      formData.append("files[]", item);
    });
  } else if (file) {
    formData.append("file", file);
  }

  return api.post("/documents", formData, {
    params:
      compression || merge !== undefined
        ? {
            compression,
            merge,
          }
        : undefined,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

type UseUploadDocumentOptions = {
  mutationConfig?: MutationConfig<typeof uploadDocument>;
};

export const useUploadDocument = ({
  mutationConfig,
}: UseUploadDocumentOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
