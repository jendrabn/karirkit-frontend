import type { SocialLink } from "@/types/social";
import type { SubscriptionPlanId } from "@/types/subscription";
import type { AdminUsageStats } from "@/types/usage";

export type UserRole = "user" | "admin";
export type UserStatus = "active" | "suspended" | "banned";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  avatar?: string | null;
  created_at?: string;
  updated_at?: string;
  email_verified_at?: string | null;
  social_links?: SocialLink[];
  status: UserStatus;
  status_reason?: string | null;
  suspended_until?: string | null;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  gender?: "male" | "female" | null;
  birth_date?: string | null;
  last_login_at?: string | null;
  subscription_plan?: SubscriptionPlanId | null;
  subscription_expires_at?: string | null;
  usage?: AdminUsageStats;
}

export const USER_ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];

export const USER_STATUS_OPTIONS = [
  { value: "active", label: "Aktif" },
  { value: "suspended", label: "Suspended" },
  { value: "banned", label: "Banned" },
] as const;
