import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;

  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

// https://reactrouter.com/start/data/route-object#lazy
const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: "/",
      lazy: () => import("./routes/landing").then(convert(queryClient)),
    },
    {
      path: "/blog",
      lazy: () => import("./routes/blog/blog").then(convert(queryClient)),
    },
    {
      path: "/blog/:slug",
      lazy: () =>
        import("./routes/blog/blog-detail").then(convert(queryClient)),
    },
    {
      path: "/auth/login",
      lazy: () => import("./routes/auth/login").then(convert(queryClient)),
    },
    {
      path: "/auth/register",
      lazy: () => import("./routes/auth/register").then(convert(queryClient)),
    },
    {
      path: "/auth/forgot-password",
      lazy: () =>
        import("./routes/auth/forgot-password").then(convert(queryClient)),
    },
    {
      path: "/auth/reset-password",
      lazy: () =>
        import("./routes/auth/reset-password").then(convert(queryClient)),
    },
    {
      path: "/auth/verify-otp",
      lazy: () => import("./routes/auth/verify-otp").then(convert(queryClient)),
    },
    {
      path: "/dashboard",
      lazy: () => import("./routes/dashboard").then(convert(queryClient)),
    },
    {
      path: "/profile",
      lazy: () => import("./routes/profile").then(convert(queryClient)),
    },
    {
      path: "/change-password",
      lazy: () => import("./routes/change-password").then(convert(queryClient)),
    },
    {
      path: "/applications",
      lazy: () =>
        import("./routes/applications/applications").then(convert(queryClient)),
    },
    {
      path: "/applications/create",
      lazy: () =>
        import("./routes/applications/applications-create").then(
          convert(queryClient)
        ),
    },
    {
      path: "/applications/:id",
      lazy: () =>
        import("./routes/applications/applications-detail").then(
          convert(queryClient)
        ),
    },
    {
      path: "/applications/:id/edit",
      lazy: () =>
        import("./routes/applications/applications-edit").then(
          convert(queryClient)
        ),
    },
    {
      path: "/application-letters",
      lazy: () =>
        import("./routes/application-letters/application-letters").then(
          convert(queryClient)
        ),
    },
    {
      path: "/application-letters/create",
      lazy: () =>
        import("./routes/application-letters/application-letters-create").then(
          convert(queryClient)
        ),
    },
    {
      path: "/application-letters/:id",
      lazy: () =>
        import("./routes/application-letters/application-letters-detail").then(
          convert(queryClient)
        ),
    },
    {
      path: "/application-letters/:id/edit",
      lazy: () =>
        import("./routes/application-letters/application-letters-edit").then(
          convert(queryClient)
        ),
    },
    {
      path: "/cvs",
      lazy: () => import("./routes/cvs/cvs").then(convert(queryClient)),
    },
    {
      path: "/cvs/create",
      lazy: () => import("./routes/cvs/cvs-create").then(convert(queryClient)),
    },
    {
      path: "/cvs/:id",
      lazy: () => import("./routes/cvs/cvs-detail").then(convert(queryClient)),
    },
    {
      path: "/cvs/:id/edit",
      lazy: () => import("./routes/cvs/cvs-edit").then(convert(queryClient)),
    },
    {
      path: "/portfolios",
      lazy: () =>
        import("./routes/portfolios/portfolios").then(convert(queryClient)),
    },
    {
      path: "/portfolios/create",
      lazy: () =>
        import("./routes/portfolios/portfolios-create").then(
          convert(queryClient)
        ),
    },
    {
      path: "/portfolios/:id",
      lazy: () =>
        import("./routes/portfolios/portfolios-detail").then(
          convert(queryClient)
        ),
    },
    {
      path: "/portfolios/:id/edit",
      lazy: () =>
        import("./routes/portfolios/portfolios-edit").then(
          convert(queryClient)
        ),
    },
    {
      path: "/my/:username",
      lazy: () => import("./routes/my/my").then(convert(queryClient)),
    },
    {
      path: "/my/:username/:id",
      lazy: () => import("./routes/my/my-detail").then(convert(queryClient)),
    },
    {
      path: "/test-general-error",
      lazy: () =>
        import("../test/general-error-test").then(convert(queryClient)),
    },
    {
      path: "*",
      lazy: () => import("./routes/not-found").then(convert(queryClient)),
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
