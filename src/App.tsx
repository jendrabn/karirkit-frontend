import { queryConfig } from "@/lib/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "react-error-boundary";
import React, { useMemo } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import MainErrorFallback from "@/components/errors/main";
import { env } from "@/config/env";
import { LoadingFallback } from "@/components/ui/loading-fallback";
import { Toaster } from "sonner";
import { RouterProvider } from "react-router";
import { createAppRouter } from "./router";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "./hooks/use-theme";

export const App = () => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <ThemeProvider defaultTheme="light" storageKey="karirkit-ui-theme">
        <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
            <AuthProvider>
              <ReactQueryDevtools initialIsOpen={env.DEBUG} />

              <React.Suspense fallback={<LoadingFallback />}>
                <RouterProvider router={router} />
                <Toaster position="top-center" />
              </React.Suspense>
            </AuthProvider>
          </GoogleOAuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
