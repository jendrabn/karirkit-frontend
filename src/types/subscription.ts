import type { ListResponse } from "@/types/api";

export type SubscriptionPlanId = "free" | "pro" | "max";
export type SubscriptionGateway = "midtrans" | "manual";

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
  max_cv_pdf_downloads: number;
  max_cv_docx_downloads: number;
  max_letter_pdf_downloads: number;
  max_letter_docx_downloads: number;
  max_cv_ai_improvements: number;
  max_application_letter_ai_improvements: number;
  can_use_premium_cv_templates: boolean;
  can_use_premium_application_letter_templates: boolean;
}

export interface SubscriptionPlansResponse {
  payment_gateway_enabled: boolean;
  plans: SubscriptionPlan[];
}

export interface SubscriptionCurrentLimits {
  max_cvs: number;
  max_applications: number;
  max_application_letters: number;
  max_document_storage_bytes: number;
  max_cv_pdf_downloads: number;
  max_cv_docx_downloads: number;
  max_letter_pdf_downloads: number;
  max_letter_docx_downloads: number;
  max_cv_ai_improvements: number;
  max_application_letter_ai_improvements: number;
}

export interface SubscriptionCurrentFeatures {
  can_use_premium_cv_templates: boolean;
  can_use_premium_application_letter_templates: boolean;
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
  gateway?: SubscriptionGateway | null;
  order_id?: string | null;
  provider_token?: string | null;
  payment_type?: string | null;
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
  subscription_id: string;
  order_id: string;
  gateway: SubscriptionGateway;
  snap_token: string | null;
  snap_url: string | null;
  amount: number;
  plan: SubscriptionPlanId;
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
  gateway?: SubscriptionGateway | null;
  order_id?: string | null;
  provider_token?: string | null;
  payment_type?: string | null;
  midtrans_order_id?: string | null;
  midtrans_token?: string | null;
  midtrans_payment_type?: string | null;
  notes?: string | null;
  user?: SubscriptionUserSummary | null;
}

export type AdminSubscriptionsResponse = ListResponse<AdminSubscription>;
