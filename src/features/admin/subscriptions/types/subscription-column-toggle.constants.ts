import { type ColumnVisibility } from "../components/subscription-column-toggle";

export const defaultColumnVisibility: ColumnVisibility = {
  user: true,
  plan: true,
  status: true,
  amount: true,
  gateway: true,
  payment_type: false,
  order_id: false,
  expires_at: true,
  created_at: true,
};
