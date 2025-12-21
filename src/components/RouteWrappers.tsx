import React from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import type { ComponentType } from "react";

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
