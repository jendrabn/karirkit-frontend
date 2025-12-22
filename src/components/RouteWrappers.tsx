import type { ComponentType } from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { AdminRoute } from "./AdminRoute";

export const withProtection = (Component: ComponentType) => {
  return () => (
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  );
};

export const withPublicProtection = (Component: ComponentType) => {
  return () => (
    <PublicRoute>
      <Component />
    </PublicRoute>
  );
};

export const withAdminProtection = (Component: ComponentType) => {
  return () => (
    <AdminRoute>
      <Component />
    </AdminRoute>
  );
};
