import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export type DownloadCoverLetterParams = {
  id: string;
  format: "pdf" | "docx";
  name?: string;
  subject?: string;
};

export const downloadCoverLetter = (
  id: string,
  format: "pdf" | "docx",
): Promise<Blob> => {
  return api.get(`/cover-letters/${id}/download`, {
    params: { format },
    responseType: "blob",
  });
};

type UseDownloadCoverLetterOptions = {
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

const generateFilename = (name?: string, subject?: string): string => {
  const safeName = sanitizeFilename(name || "");
  const safeSubject = sanitizeFilename(subject || "");
  return `Surat_Lamaran_${safeName}_${safeSubject}`;
};

export const useDownloadCoverLetter = (
  options?: UseDownloadCoverLetterOptions,
) => {
  return useMutation<Blob, AxiosError, DownloadCoverLetterParams>({
    mutationFn: ({ id, format }: DownloadCoverLetterParams) =>
      downloadCoverLetter(id, format),

    onSuccess: (data, variables) => {
      const filename = generateFilename(variables.name, variables.subject);
      createDownloadLink(data, filename, variables.format);

      toast.success(
        `Berhasil mengunduh surat lamaran (${variables.format.toUpperCase()})`,
      );

      options?.onSuccess?.();
    },

    onError: () => {
      options?.onError?.();
    },
  });
};
