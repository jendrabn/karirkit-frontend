export type ErrorResponse = {
  [field: string]: string[];
};

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string | null;
  role: "user" | "admin" | "superadmin";
  avatar?: string | null;
  created_at: string;
  updated_at: string;
};
