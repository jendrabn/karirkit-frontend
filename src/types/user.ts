import type { DocumentStorageStats, DownloadStats } from "@/types/storage";
import type { SocialLink } from "@/types/social";

export type UserRole = "user" | "admin";
export type UserStatus = "active" | "suspended" | "banned";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  status_reason: string | null;
  suspended_until: string | null;

  avatar: string;
  daily_download_limit: number;
  download_stats?: DownloadStats;
  total_count?: number;
  document_storage_limit: number;
  document_storage_stats: DocumentStorageStats;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  gender?: string | null;
  birth_date?: string | null;
  created_at: string;
  updated_at: string;
  social_links: SocialLink[];
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
