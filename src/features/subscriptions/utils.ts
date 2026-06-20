import {
  type MySubscription,
  type SubscriptionCurrentFeatures,
  type SubscriptionCurrentLimits,
  type SubscriptionPlan,
  type SubscriptionPlanId,
  type SubscriptionStatus,
} from "@/types/subscription";
import { formatBytes, formatCurrency } from "@/lib/utils";

export const SUBSCRIPTION_PLAN_LABELS: Record<SubscriptionPlanId, string> = {
  free: "Free",
  pro: "Pro",
  max: "Max",
};

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: "Aktif",
  pending: "Menunggu Pembayaran",
  paid: "Dibayar",
  expired: "Kedaluwarsa",
  failed: "Gagal",
  cancelled: "Dibatalkan",
};

export const formatSubscriptionLimit = (value?: number | null) => {
  if (value == null) return "-";
  return value === -1 ? "Unlimited" : new Intl.NumberFormat("id-ID").format(value);
};

export const formatSubscriptionStorage = (bytes?: number | null) => {
  if (bytes == null) return "-";
  if (bytes === -1) return "Unlimited";
  if (bytes === 0) return "0 Bytes";
  return formatBytes(bytes);
};

export const formatSubscriptionPrice = (price?: number | null) => {
  if (price == null) return "-";
  return formatCurrency(price);
};

export const getPlanFeatureAccess = (
  features?: SubscriptionCurrentFeatures | null,
  plan?: SubscriptionPlan | null,
) => {
  return {
    canUsePremiumCvTemplates:
      features?.can_use_premium_cv_templates ??
      plan?.can_use_premium_cv_templates ??
      false,
    canUsePremiumApplicationLetterTemplates:
      features?.can_use_premium_application_letter_templates ??
      plan?.can_use_premium_application_letter_templates ??
      false,
  };
};

export const getSubscriptionLimits = (
  subscription?: MySubscription | null,
  plan?: SubscriptionPlan | null,
): SubscriptionCurrentLimits | null => {
  if (subscription?.current_limits) {
    return subscription.current_limits;
  }

  if (!plan) {
    return null;
  }

  return {
    max_cvs: plan.max_cvs,
    max_applications: plan.max_applications,
    max_application_letters: plan.max_application_letters,
    max_document_storage_bytes: plan.max_document_storage_bytes,
    max_cv_pdf_downloads: plan.max_cv_pdf_downloads,
    max_cv_docx_downloads: plan.max_cv_docx_downloads,
    max_letter_pdf_downloads: plan.max_letter_pdf_downloads,
    max_letter_docx_downloads: plan.max_letter_docx_downloads,
    max_cv_ai_improvements: plan.max_cv_ai_improvements,
    max_application_letter_ai_improvements: plan.max_application_letter_ai_improvements,
  };
};
