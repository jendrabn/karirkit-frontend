export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;

  avatar: string;
  daily_download_limit: number;
  created_at: string;
  updated_at: string;
}

export const USER_ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];
