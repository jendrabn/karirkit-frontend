export interface UsageQuotaItem {
  limit: number;
  used: number;
  remaining: number;
}

export interface UserUsageQuota {
  max_cvs: UsageQuotaItem;
  max_application_letters: UsageQuotaItem;
  max_applications: UsageQuotaItem;
  max_document_storage_bytes: UsageQuotaItem;
  max_cv_pdf_downloads: UsageQuotaItem;
  max_cv_docx_downloads: UsageQuotaItem;
  max_letter_pdf_downloads: UsageQuotaItem;
  max_letter_docx_downloads: UsageQuotaItem;
  max_cv_ai_improvements: UsageQuotaItem;
  max_application_letter_ai_improvements: UsageQuotaItem;
  can_use_premium_cv_templates: boolean;
  can_use_premium_application_letter_templates: boolean;
}

export type AdminUsageStats = Record<
  | "max_cvs"
  | "max_application_letters"
  | "max_applications"
  | "max_document_storage_bytes"
  | "max_cv_pdf_downloads"
  | "max_cv_docx_downloads"
  | "max_letter_pdf_downloads"
  | "max_letter_docx_downloads"
  | "max_cv_ai_improvements"
  | "max_application_letter_ai_improvements",
  number
>;
