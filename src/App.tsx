import { queryConfig } from "@/lib/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "react-error-boundary";
import React, { useMemo } from "react";
import MainErrorFallback from "@/components/errors/main";
import { env } from "@/config/env";
import { LoadingFallback } from "@/components/ui/loading-fallback";
import { Toaster } from "@/components/ui/sonner";
import { RouterProvider } from "react-router";
import { createAppRouter } from "./router";

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
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={env.DEBUG} />

        <React.Suspense fallback={<LoadingFallback />}>
          <RouterProvider router={router} />
          <Toaster />
        </React.Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
