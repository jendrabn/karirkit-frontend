import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import { Link } from "react-router";
import { paths } from "@/config/paths";
import type { FallbackProps } from "react-error-boundary";

const MainErrorFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
    <MainErrorContent
      error={error}
      resetErrorBoundary={resetErrorBoundary}
    />
  </div>
);

function MainErrorContent({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const { t } = useTranslation("common");

  return (
    <div className="max-w-md w-full text-center space-y-8">
      {/* Error Icon with Animation */}
      <div className="relative">
        <div className="text-9xl text-destructive/10 select-none flex items-center justify-center">
          <AlertTriangle className="w-32 h-32" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          {t("error.generic")}
        </h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          {t("error.unexpected")}
        </p>
        <div className="p-3 bg-destructive/10 rounded-lg">
          <p className="text-xs text-destructive font-mono break-all">
            {error instanceof Error ? error.message : t("error.unknown")}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={resetErrorBoundary} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          {t("action.retry")}
        </Button>

        <Button asChild variant="outline" className="gap-2">
          <Link to={paths.home.getHref()}>
            <Home className="h-4 w-4" />
            {t("nav.home")}
          </Link>
        </Button>
      </div>

      {/* Help Text */}
      <div className="pt-4 border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          {t("error.contactSupportPrefix")}{" "}
          <Link to="/contact" className="text-primary hover:underline">
            {t("action.contactSupport")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default MainErrorFallback;
