import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import { paths } from "@/config/paths";
import { MinimalSEO } from "@/components/minimal-seo";

export function AppErrorBoundary() {
  const error = useRouteError();

  let errorMessage = "Terjadi kesalahan yang tidak terduga.";
  let errorStatusText = "Terjadi Kesalahan";

  if (isRouteErrorResponse(error)) {
    errorStatusText = `${error.status} ${error.statusText}`;
    errorMessage = error.data?.message || error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>
      <MinimalSEO title="Terjadi Kesalahan" noIndex={true} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="relative">
            <div className="text-9xl text-destructive/10 select-none flex items-center justify-center">
              <AlertTriangle className="w-28 h-28 text-destructive/50" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              {errorStatusText}
            </h1>
            <p className="text-muted-foreground max-w-sm mx-auto text-sm">
              Maaf, terjadi kendala saat memuat halaman ini. Silakan coba muat ulang atau kembali ke halaman utama.
            </p>
            {import.meta.env.DEV && (
              <div className="p-3 bg-destructive/10 rounded-lg text-left">
                <p className="text-xs text-destructive font-mono break-all">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleReload} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Muat Ulang Halaman
            </Button>

            <Button asChild variant="outline" className="gap-2">
              <Link to={paths.home.getHref()}>
                <Home className="h-4 w-4" />
                Beranda
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppErrorBoundary;
