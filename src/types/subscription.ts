import type { ListResponse } from "@/types/api";

export type SubscriptionPlanId = "free" | "pro" | "max";

export type SubscriptionStatus =
  | "active"
  | "pending"
  | "paid"
  | "expired"
  | "failed"
  | "cancelled";

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  price: number;
  duration_days: number;
  max_cvs: number;
  max_applications: number;
  max_application_letters: number;
  max_document_storage_bytes: number;
  cv_downloads_per_day: number;
  application_letter_downloads_per_day: number;
  cv_docx_downloads_per_day: number;
  application_letter_docx_downloads_per_day: number;
  cv_pdf_downloads_per_day: number;
  application_letter_pdf_downloads_per_day: number;
  can_manage_documents: boolean;
  can_use_premium_cv_templates?: boolean;
  can_use_premium_application_letter_templates?: boolean;
  can_use_premium_templates?: boolean;
  can_duplicate_cvs: boolean;
  can_duplicate_applications: boolean;
  can_duplicate_application_letters: boolean;
  can_duplicate_documents?: boolean;
  can_download_cv_docx: boolean;
  can_download_application_letter_docx: boolean;
  can_download_cv_pdf: boolean;
  can_download_application_letter_pdf: boolean;
}

export interface SubscriptionDownloadLimits {
  cv_per_day: number;
  application_letter_per_day: number;
}

export interface SubscriptionCurrentLimits {
  max_cvs: number;
  max_applications: number;
  max_application_letters: number;
  max_document_storage_bytes: number;
  downloads: SubscriptionDownloadLimits;
}

export interface SubscriptionCurrentFeatures {
  can_manage_documents: boolean;
  can_use_premium_cv_templates?: boolean;
  can_use_premium_application_letter_templates?: boolean;
  can_use_premium_templates?: boolean;
  can_duplicate_cvs?: boolean;
  can_duplicate_applications?: boolean;
  can_duplicate_application_letters?: boolean;
  can_duplicate_documents?: boolean;
  can_download_cv_docx?: boolean;
  can_download_application_letter_docx?: boolean;
  can_download_cv_pdf: boolean;
  can_download_application_letter_pdf: boolean;
}

export interface MySubscription {
  id?: string | null;
  plan: SubscriptionPlanId;
  pending_plan?: SubscriptionPlanId | null;
  pendingPlan?: SubscriptionPlanId | null;
  status: SubscriptionStatus;
  amount?: number | null;
  paid_at?: string | null;
  expires_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  midtrans_order_id?: string | null;
  midtrans_payment_type?: string | null;
  snap_token?: string | null;
  snapToken?: string | null;
  snap_url?: string | null;
  snapUrl?: string | null;
  can_resume_payment?: boolean;
  canResumePayment?: boolean;
  current_limits: SubscriptionCurrentLimits;
  current_features: SubscriptionCurrentFeatures;
}

export interface SubscriptionOrderResponse {
  id?: string;
  subscription_id?: string;
  order_id?: string;
  amount?: number;
  plan?: SubscriptionPlanId;
  redirectUrl?: string | null;
  redirect_url?: string | null;
  paymentUrl?: string | null;
  payment_url?: string | null;
  snapUrl?: string | null;
  snap_url?: string | null;
  snapToken?: string | null;
  snap_token?: string | null;
  token?: string | null;
  [key: string]: unknown;
}

export interface SubscriptionUserSummary {
  id: string;
  name?: string | null;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  subscription_plan?: SubscriptionPlanId | null;
  subscription_expires_at?: string | null;
}

export interface AdminSubscription {
  id: string;
  user_id?: string | null;
  plan: SubscriptionPlanId;
  status: SubscriptionStatus;
  amount?: number | null;
  paid_at?: string | null;
  expires_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  midtrans_order_id?: string | null;
  midtrans_payment_type?: string | null;
  notes?: string | null;
  user?: SubscriptionUserSummary | null;
}

export type AdminSubscriptionsResponse = ListResponse<AdminSubscription>;
