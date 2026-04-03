import { type ColumnVisibility } from "../components/SubscriptionColumnToggle";

export const defaultColumnVisibility: ColumnVisibility = {
  user: true,
  plan: true,
  status: true,
  amount: true,
  payment_type: false,
  order_id: false,
  expires_at: true,
  created_at: true,
};
