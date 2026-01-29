import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export type DownloadCVParams = {
  id: string;
  format: "pdf" | "docx";
  name?: string;
  headline?: string;
};

export const downloadCV = (
  id: string,
  format: "pdf" | "docx",
): Promise<Blob> => {
  return api.get(`/cvs/${id}/download`, {
    params: { format },
    responseType: "blob",
  });
};

type UseDownloadCVOptions = {
  onSuccess?: () => void;
  onError?: () => void;
};

const createDownloadLink = (
  blob: Blob,
  filename: string,
  extension: string,
): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.${extension}`);

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};

const sanitizeFilename = (text: string): string => {
  return text.replace(/\s+/g, "_");
};

const generateFilename = (name?: string, headline?: string): string => {
  const safeName = sanitizeFilename(name || "");
  const safeHeadline = sanitizeFilename(headline || "");
  return `CV_${safeName}_${safeHeadline}`;
};

export const useDownloadCV = (options?: UseDownloadCVOptions) => {
  return useMutation<Blob, AxiosError, DownloadCVParams>({
    mutationFn: ({ id, format }: DownloadCVParams) => downloadCV(id, format),

    onSuccess: (data, variables) => {
      const filename = generateFilename(variables.name, variables.headline);
      createDownloadLink(data, filename, variables.format);

      toast.success(
        `Berhasil mengunduh CV (${variables.format.toUpperCase()})`,
      );

      options?.onSuccess?.();
    },

    onError: () => {
      options?.onError?.();
    },
  });
};
