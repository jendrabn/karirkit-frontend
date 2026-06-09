import { createBrowserRouter } from "react-router";
import type { LoaderFunction, ActionFunction } from "react-router";
import type { QueryClient } from "@tanstack/react-query";
import type { ComponentType } from "react";
import {
  withProtection,
  withPublicProtection,
  withAdminProtection,
} from "@/components/route-wrappers";
import { LoadingFallback } from "@/components/ui/loading-fallback";

type RouteModule = {
  default: ComponentType;

  clientLoader?: (queryClient: QueryClient) => LoaderFunction;

  clientAction?: (queryClient: QueryClient) => ActionFunction;
};

const convert = (queryClient: QueryClient) => (module: RouteModule) => {
  const { default: Component, clientLoader, clientAction } = module;

  return {
    Component,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
  };
};

const convertWithProtection =
  (queryClient: QueryClient) => (module: RouteModule) => {
    const { default: Component, clientLoader, clientAction } = module;

    return {
      Component: withProtection(Component),
      loader: clientLoader?.(queryClient),
      action: clientAction?.(queryClient),
    };
  };

const convertWithAdminProtection =
  (queryClient: QueryClient) => (module: RouteModule) => {
    const { default: Component, clientLoader, clientAction } = module;

    return {
      Component: withAdminProtection(Component),
      loader: clientLoader?.(queryClient),
      action: clientAction?.(queryClient),
    };
  };

const convertWithPublicProtection =
  (queryClient: QueryClient) => (module: RouteModule) => {
    const { default: Component, clientLoader, clientAction } = module;

    return {
      Component: withPublicProtection(Component),
      loader: clientLoader?.(queryClient),
      action: clientAction?.(queryClient),
    };
  };

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      HydrateFallback: LoadingFallback,
      children: [
        // Public routes (no authentication required)
        {
          path: "/",
          lazy: () => import("./pages/landing").then(convert(queryClient)),
        },
        {
          path: "/blog",
          lazy: () => import("./pages/blog").then(convert(queryClient)),
        },
        {
          path: "/blog/:slug",
          lazy: () => import("./pages/blog-detail").then(convert(queryClient)),
        },
        {
          path: "/jobs",
          lazy: () => import("./pages/jobs").then(convert(queryClient)),
        },
        {
          path: "/jobs/:slug",
          lazy: () => import("./pages/job-detail").then(convert(queryClient)),
        },
        {
          path: "/pricing",
          lazy: () => import("./pages/pricing").then(convert(queryClient)),
        },
        {
          path: "/u/:username",
          lazy: () =>
            import("./pages/public-portfolios").then(convert(queryClient)),
        },
        {
          path: "/u/:username/:id",
          lazy: () =>
            import("./pages/public-portfolio-show").then(convert(queryClient)),
        },
        {
          path: "/cv/:slug",
          lazy: () => import("./pages/public-cv-show").then(convert(queryClient)),
        },
        // Auth routes (only for non-authenticated users)
        {
          path: "/login",
          lazy: () =>
            import("./pages/auth").then(
              convertWithPublicProtection(queryClient)
            ),
        },
        {
          path: "/register",
          lazy: () =>
            import("./pages/auth").then(
              convertWithPublicProtection(queryClient)
            ),
        },
        // Protected routes (authentication required)
        {
          path: "/dashboard",
          lazy: () =>
            import("./pages/dashboard").then(convertWithProtection(queryClient)),
        },
        {
          path: "/profile",
          lazy: () =>
            import("./pages/profile").then(convertWithProtection(queryClient)),
        },
        {
          path: "/notifications",
          lazy: () =>
            import("./pages/notification-settings").then(
              convertWithProtection(queryClient)
            ),
        },
        {
          path: "/saved-jobs",
          lazy: () =>
            import("./pages/saved-jobs").then(convertWithProtection(queryClient)),
        },
        {
          path: "/applications",
          lazy: () =>
            import("./pages/applications").then(
              convertWithProtection(queryClient)
            ),
        },
        {
          path: "/applications/create",
          lazy: () =>
            import("./pages/application-create").then(
              convertWithProtection(queryClient)
            ),
        },
        {
          path: "/applications/:id",
          lazy: () =>
            import("./pages/application-show").then(
              convertWithProtection(queryClient)
            ),
        },
        {
          path: "/applications/:id/edit",
          lazy: () =>
            import("./pages/application-edit").then(
              convertWithProtection(queryClient)
            ),
        },
        {
          path: "/application-letters",
          lazy: () =>
            import("./pages/application-letters").then(
              convertWithProtection(queryClient)
            ),
        },
        {
          path: "/application-letters/create",
          lazy: () =>
            import("./pages/application-letter-create").then(
              convertWithProtection(queryClient)
            ),
        },
        {
          path: "/application-letters/:id",
          lazy: () =>
            import("./pages/application-letter-show").then(
              convertWithProtection(queryClient)
            ),
        },
        {
          path: "/application-letters/:id/edit",
          lazy: () =>
            import("./pages/application-letter-edit").then(
              convertWithProtection(queryClient)
            ),
        },
        {
          path: "/cvs",
          lazy: () => import("./pages/c-vs").then(convertWithProtection(queryClient)),
        },
        {
          path: "/cvs/create",
          lazy: () =>
            import("./pages/cv-create").then(convertWithProtection(queryClient)),
        },
        {
          path: "/cvs/:id",
          lazy: () =>
            import("./pages/cv-show").then(convertWithProtection(queryClient)),
        },
        {
          path: "/cvs/:id/edit",
          lazy: () =>
            import("./pages/cv-edit").then(convertWithProtection(queryClient)),
        },
        {
          path: "/portfolios",
          lazy: () =>
            import("./pages/portfolios").then(
              convertWithProtection(queryClient)
            ),
        },
        {
          path: "/portfolios/create",
          lazy: () =>
            import("./pages/portfolio-create").then(
              convertWithProtection(queryClient)
            ),
        },
        {
          path: "/portfolios/:id",
          lazy: () =>
            import("./pages/portfolio-show").then(
              convertWithProtection(queryClient)
            ),
        },
        {
          path: "/portfolios/:id/edit",
          lazy: () =>
            import("./pages/portfolio-edit").then(
              convertWithProtection(queryClient)
            ),
        },
        {
          path: "/documents",
          lazy: () =>
            import("./pages/documents").then(convertWithProtection(queryClient)),
        },
        {
          path: "/subscriptions",
          lazy: () =>
            import("./pages/subscription").then(convertWithProtection(queryClient)),
        },
        // Admin routes (authentication and admin role required)
        {
          path: "/admin/dashboard",
          lazy: () =>
            import("./pages/admin-dashboard").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/users",
          lazy: () =>
            import("./pages/admin-users").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/users/create",
          lazy: () =>
            import("./pages/admin-user-create").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/users/:id/edit",
          lazy: () =>
            import("./pages/admin-user-edit").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/users/:id",
          lazy: () =>
            import("./pages/admin-user-show").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/blogs",
          lazy: () =>
            import("./pages/admin-blogs").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/blogs/create",
          lazy: () =>
            import("./pages/admin-blog-create").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/blogs/:id/edit",
          lazy: () =>
            import("./pages/admin-blog-edit").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/blogs/:id",
          lazy: () =>
            import("./pages/admin-blog-show").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/blogs/m/categories",
          lazy: () =>
            import("./pages/admin-blog-categories").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/blogs/m/tags",
          lazy: () =>
            import("./pages/admin-blog-tags").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/templates",
          lazy: () =>
            import("./pages/admin-templates").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/templates/create",
          lazy: () =>
            import("./pages/admin-template-create").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/templates/guide",
          lazy: () =>
            import("./pages/admin-template-guide").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/templates/:id/edit",
          lazy: () =>
            import("./pages/admin-template-edit").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/templates/:id",
          lazy: () =>
            import("./pages/admin-template-show").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/subscriptions",
          lazy: () =>
            import("./pages/admin-subscriptions").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/subscriptions/:id",
          lazy: () =>
            import("./pages/admin-subscription-show").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/jobs",
          lazy: () =>
            import("./pages/admin-jobs").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/jobs/create",
          lazy: () =>
            import("./pages/admin-job-create").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/jobs/:id/edit",
          lazy: () =>
            import("./pages/admin-job-edit").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/jobs/:id",
          lazy: () =>
            import("./pages/admin-job-show").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/jobs/m/companies",
          lazy: () =>
            import("./pages/admin-companies").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "/admin/jobs/m/roles",
          lazy: () =>
            import("./pages/admin-job-roles").then(
              convertWithAdminProtection(queryClient)
            ),
        },
        {
          path: "*",
          lazy: () => import("./pages/not-found").then(convert(queryClient)),
        },
      ],
    },
  ]);
