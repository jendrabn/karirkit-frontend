import { queryConfig } from "@/lib/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "react-error-boundary";
import React, { useEffect, useMemo } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";

import MainErrorFallback from "@/components/errors/main";
import { env } from "@/config/env";
import { LoadingFallback } from "@/components/ui/loading-fallback";
import { Toaster } from "@/components/ui/sonner";
import { RouterProvider } from "react-router";
import { createAppRouter } from "./router";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "./hooks/use-theme";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { PWAUpdatePrompt } from "@/components/PWAUpdatePrompt";

export const App = () => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  useEffect(() => {
    if (!import.meta.env.PROD) {
      return;
    }

    const manifestSelector = 'link[data-karirkit-manifest="true"]';
    const existingManifest = document.head.querySelector<HTMLLinkElement>(
      manifestSelector
    );

    if (existingManifest) {
      return;
    }

    const manifestLink = document.createElement("link");
    manifestLink.rel = "manifest";
    manifestLink.href = "/manifest.webmanifest";
    manifestLink.setAttribute("data-karirkit-manifest", "true");
    document.head.appendChild(manifestLink);

    return () => {
      manifestLink.remove();
    };
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV || !("serviceWorker" in navigator)) {
      return;
    }

    let isMounted = true;
    const reloadMarker = "karirkit-dev-sw-reset";

    const cleanupDevelopmentPwa = async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();

      if (!registrations.length) {
        sessionStorage.removeItem(reloadMarker);
        return;
      }

      await Promise.allSettled(
        registrations.map((registration) => registration.unregister())
      );

      if ("caches" in window) {
        const cacheKeys = await caches.keys();

        await Promise.allSettled(
          cacheKeys.map((cacheKey) => caches.delete(cacheKey))
        );
      }

      if (!isMounted || sessionStorage.getItem(reloadMarker)) {
        return;
      }

      sessionStorage.setItem(reloadMarker, "true");
      window.location.reload();
    };

    void cleanupDevelopmentPwa();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <ThemeProvider defaultTheme="light" storageKey="karirkit-ui-theme">
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
              <AuthProvider>
                <ReactQueryDevtools initialIsOpen={env.DEBUG} />

                <React.Suspense fallback={<LoadingFallback />}>
                  <RouterProvider router={router} />
                  <Toaster position="top-center" />
                  <PWAInstallPrompt />
                  <PWAUpdatePrompt />
                </React.Suspense>
              </AuthProvider>
            </GoogleOAuthProvider>
          </HelmetProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
