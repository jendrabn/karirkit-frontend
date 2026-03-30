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
  const canDuplicateCvs =
    features?.can_duplicate_cvs ?? plan?.can_duplicate_cvs ?? true;
  const canDuplicateApplications =
    features?.can_duplicate_applications ?? plan?.can_duplicate_applications ?? true;
  const canDuplicateApplicationLetters =
    features?.can_duplicate_application_letters ??
    plan?.can_duplicate_application_letters ??
    true;

  return {
    canManageDocuments:
      features?.can_manage_documents ?? plan?.can_manage_documents ?? false,
    canUsePremiumCvTemplates:
      features?.can_use_premium_cv_templates ??
      features?.can_use_premium_templates ??
      plan?.can_use_premium_cv_templates ??
      plan?.can_use_premium_templates ??
      false,
    canUsePremiumApplicationLetterTemplates:
      features?.can_use_premium_application_letter_templates ??
      features?.can_use_premium_templates ??
      plan?.can_use_premium_application_letter_templates ??
      plan?.can_use_premium_templates ??
      false,
    canDuplicateCvs,
    canDuplicateApplications,
    canDuplicateApplicationLetters,
    canDuplicateDocuments:
      features?.can_duplicate_documents ??
      plan?.can_duplicate_documents ??
      (canDuplicateCvs &&
        canDuplicateApplications &&
        canDuplicateApplicationLetters),
    canDownloadCvDocx:
      features?.can_download_cv_docx ?? plan?.can_download_cv_docx ?? true,
    canDownloadApplicationLetterDocx:
      features?.can_download_application_letter_docx ??
      plan?.can_download_application_letter_docx ??
      true,
    canDownloadCvPdf:
      features?.can_download_cv_pdf ?? plan?.can_download_cv_pdf ?? true,
    canDownloadApplicationLetterPdf:
      features?.can_download_application_letter_pdf ??
      plan?.can_download_application_letter_pdf ??
      true,
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
    downloads: {
      cv_per_day: plan.cv_downloads_per_day,
      application_letter_per_day: plan.application_letter_downloads_per_day,
    },
  };
};
