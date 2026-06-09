import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/contexts/auth-context";
import { LoadingFallback } from "@/components/ui/loading-fallback";
import { paths } from "@/config/paths";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = paths.auth.getHref(),
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading only on initial load, not on every re-render
  if (isLoading && !isAuthenticated) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
