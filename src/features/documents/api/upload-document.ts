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
  name?: string;
  file?: File | File[];
};

export const uploadDocument = ({
  file,
  type,
  compression,
  name,
}: UploadDocumentInput): Promise<Document | Document[]> => {
  const formData = new FormData();
  formData.append("type", type);
  if (name) {
    formData.append("name", name);
  }

  if (Array.isArray(file)) {
    file.forEach((item) => {
      formData.append("file[]", item);
    });
  } else if (file) {
    formData.append("file", file);
  }

  return api.post("/documents", formData, {
    params: compression ? { compression } : undefined,
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
