import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingFallback } from "@/components/ui/loading-fallback";
import { paths } from "@/config/paths";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading only on initial load
  if (isLoading && !isAuthenticated) {
    return <LoadingFallback />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={paths.auth.login.getHref()} state={{ from: location }} replace />;
  }

  // Redirect to dashboard if authenticated but not admin
  if (user && user.role !== "admin") {
    return <Navigate to={paths.dashboard.getHref()} replace />;
  }

  return <>{children}</>;
};
