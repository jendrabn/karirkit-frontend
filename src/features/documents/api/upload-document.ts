import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type {
  Document,
  DocumentCompressionLevel,
  DocumentType,
} from "@/types/document";

export type UploadDocumentInput = {
  file: File;
  type: DocumentType;
  compression?: DocumentCompressionLevel;
};

export const uploadDocument = ({
  file,
  type,
  compression,
}: UploadDocumentInput): Promise<Document> => {
  const formData = new FormData();
  formData.append("type", type);
  formData.append("file", file);

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
