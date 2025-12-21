import { Navigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingFallback } from "@/components/ui/loading-fallback";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = "/dashboard",
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading only on initial load, not on every re-render
  if (isLoading && isAuthenticated) {
    return <LoadingFallback />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
