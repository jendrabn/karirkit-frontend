import type { DocumentStorageStats, DownloadStats } from "@/types/storage";
import type { SocialLink } from "@/types/social";

export type UserRole = "user" | "admin";
export type UserStatus = "active" | "suspended" | "banned";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  role: UserRole;
  avatar: string | null;
  created_at: string;
  updated_at: string;
  /** @alias download_stats.total */
  total_downloads?: number;
  email_verified_at?: string | null;
  download_stats?: DownloadStats;
  daily_download_limit: number;
  document_storage_limit: number;
  document_storage_stats?: DocumentStorageStats;
  social_links?: SocialLink[];
  status: UserStatus;
  status_reason?: string | null;
  suspended_until?: string | null;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  gender?: "male" | "female" | null;
  birth_date?: string | null;
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
