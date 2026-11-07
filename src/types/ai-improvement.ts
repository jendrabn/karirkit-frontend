export type AiImprovementChange = {
  path: string;
  label: string;
  change_type: string;
};

export type AiImprovementSummary = {
  changed_fields_count: number;
  summary: string[];
  changed_fields?: AiImprovementChange[];
};

export type AiImprovementMeta = {
  improvement_summary?: AiImprovementSummary;
};

export type AiImprovementResponse<T> = {
  data: T;
  meta?: AiImprovementMeta;
};

export const getAiImprovementErrorMessage = (error: unknown): string => {
  const responseData = (
    error as {
      response?: {
        data?: {
          message?: string;
          errors?: Record<string, string[] | string>;
        };
      };
    }
  )?.response?.data;

  const generalErrors = responseData?.errors?.general;

  if (Array.isArray(generalErrors) && generalErrors.length > 0) {
    return generalErrors[0];
  }

  if (typeof generalErrors === "string") {
    return generalErrors;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  return "Proses perbaikan dengan AI gagal. Silakan coba lagi.";
};
