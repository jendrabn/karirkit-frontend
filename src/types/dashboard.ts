import type { Blog } from "@/types/blog";
import type { SubscriptionPlanId } from "@/types/subscription";
import type { User } from "@/types/user";

export interface DashboardStats {
  total_applications: number;
  active_applications: number;
  inactive_applications: number;
  total_application_letters: number;
  total_cvs: number;
  total_portfolios: number;
  interview_applications: number;
  offer_applications: number;
  accepted_applications: number;
  rejected_applications: number;
  needs_followup_applications: number;
  overdue_applications: number;
  no_followup_applications: number;
  total_documents: number;
  saved_jobs_count: number;
  subscription_plan?: SubscriptionPlanId | null;
  subscription_expires_at?: string | null;
  download_today_count: number;
  download_total_count: number;
  document_storage_limit?: number | null;
  document_storage_used?: number | null;
  document_storage_remaining?: number | null;
}

export type DashboardStatsResponse = DashboardStats;

export type DashboardDistribution = Record<string, number>;

export interface AdminDashboardStatistics {
  total_accounts: number;
  total_users: number;
  total_admins: number;
  total_blogs: number;
  total_published_blogs: number;
  total_draft_blogs: number;
  total_archived_blogs: number;
  total_categories: number;
  total_tags: number;
  total_templates: number;
  total_cv_templates: number;
  total_application_letter_templates: number;
  total_jobs: number;
  total_published_jobs: number;
  total_draft_jobs: number;
  total_closed_jobs: number;
  total_archived_jobs: number;
  total_companies: number;
  total_job_roles: number;
  total_subscriptions: number;
  total_pending_subscriptions: number;
  total_paid_subscriptions: number;
  total_failed_subscriptions: number;
  total_cancelled_subscriptions: number;
  total_expired_subscriptions: number;
  total_subscription_revenue: number;
  user_status_distribution: DashboardDistribution;
  job_status_distribution: DashboardDistribution;
  subscription_status_distribution: DashboardDistribution;
  recent_users?: User[];
  recent_blogs?: Blog[];
}
