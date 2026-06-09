import type { ComponentType } from "react";
import { ProtectedRoute } from "./protected-route";
import { PublicRoute } from "./public-route";
import { AdminRoute } from "./admin-route";

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
