import { createBrowserRouter } from "react-router";
import type { LoaderFunction, ActionFunction } from "react-router";
import type { QueryClient } from "@tanstack/react-query";
import type { ComponentType } from "react";
import {
  withProtection,
  withPublicProtection,
  withAdminProtection,
} from "@/components/RouteWrappers";

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
    // Public routes (no authentication required)
    {
      path: "/",
      lazy: () => import("./pages/Landing").then(convert(queryClient)),
    },
    {
      path: "/blog",
      lazy: () => import("./pages/Blog").then(convert(queryClient)),
    },
    {
      path: "/blog/:slug",
      lazy: () => import("./pages/BlogDetail").then(convert(queryClient)),
    },
    {
      path: "/jobs",
      lazy: () => import("./pages/Jobs").then(convert(queryClient)),
    },
    {
      path: "/jobs/:slug",
      lazy: () => import("./pages/JobDetail").then(convert(queryClient)),
    },
    {
      path: "/u/:username",
      lazy: () => import("./pages/PublicPortfolios").then(convert(queryClient)),
    },
    {
      path: "/u/:username/:id",
      lazy: () =>
        import("./pages/PublicPortfolioShow").then(convert(queryClient)),
    },
    // Auth routes (only for non-authenticated users)
    {
      path: "/auth/login",
      lazy: () =>
        import("./pages/Login").then(convertWithPublicProtection(queryClient)),
    },
    {
      path: "/auth/register",
      lazy: () =>
        import("./pages/Register").then(
          convertWithPublicProtection(queryClient)
        ),
    },
    {
      path: "/auth/forgot-password",
      lazy: () =>
        import("./pages/ForgotPassword").then(
          convertWithPublicProtection(queryClient)
        ),
    },
    {
      path: "/auth/reset-password",
      lazy: () =>
        import("./pages/ResetPassword").then(
          convertWithPublicProtection(queryClient)
        ),
    },
    {
      path: "/auth/verify-otp",
      lazy: () =>
        import("./pages/OTPVerification").then(
          convertWithPublicProtection(queryClient)
        ),
    },
    // Protected routes (authentication required)
    {
      path: "/dashboard",
      lazy: () =>
        import("./pages/Dashboard").then(convertWithProtection(queryClient)),
    },
    {
      path: "/profile",
      lazy: () =>
        import("./pages/Profile").then(convertWithProtection(queryClient)),
    },
    {
      path: "/change-password",
      lazy: () =>
        import("./pages/ChangePassword").then(
          convertWithProtection(queryClient)
        ),
    },
    {
      path: "/bookmarks",
      lazy: () =>
        import("./pages/SavedJobs").then(convertWithProtection(queryClient)),
    },
    {
      path: "/applications",
      lazy: () =>
        import("./pages/Applications").then(convertWithProtection(queryClient)),
    },
    {
      path: "/applications/create",
      lazy: () =>
        import("./pages/ApplicationCreate").then(
          convertWithProtection(queryClient)
        ),
    },
    {
      path: "/applications/:id",
      lazy: () =>
        import("./pages/ApplicationShow").then(
          convertWithProtection(queryClient)
        ),
    },
    {
      path: "/applications/:id/edit",
      lazy: () =>
        import("./pages/ApplicationEdit").then(
          convertWithProtection(queryClient)
        ),
    },
    {
      path: "/application-letters",
      lazy: () =>
        import("./pages/ApplicationLetters").then(
          convertWithProtection(queryClient)
        ),
    },
    {
      path: "/application-letters/create",
      lazy: () =>
        import("./pages/ApplicationLetterCreate").then(
          convertWithProtection(queryClient)
        ),
    },
    {
      path: "/application-letters/:id",
      lazy: () =>
        import("./pages/ApplicationLetterShow").then(
          convertWithProtection(queryClient)
        ),
    },
    {
      path: "/application-letters/:id/edit",
      lazy: () =>
        import("./pages/ApplicationLetterEdit").then(
          convertWithProtection(queryClient)
        ),
    },
    {
      path: "/cvs",
      lazy: () =>
        import("./pages/CVs").then(convertWithProtection(queryClient)),
    },
    {
      path: "/cvs/create",
      lazy: () =>
        import("./pages/CVCreate").then(convertWithProtection(queryClient)),
    },
    {
      path: "/cvs/:id",
      lazy: () =>
        import("./pages/CVShow").then(convertWithProtection(queryClient)),
    },
    {
      path: "/cvs/:id/edit",
      lazy: () =>
        import("./pages/CVEdit").then(convertWithProtection(queryClient)),
    },
    {
      path: "/portfolios",
      lazy: () =>
        import("./pages/Portfolios").then(convertWithProtection(queryClient)),
    },
    {
      path: "/portfolios/create",
      lazy: () =>
        import("./pages/PortfolioCreate").then(
          convertWithProtection(queryClient)
        ),
    },
    {
      path: "/portfolios/:id",
      lazy: () =>
        import("./pages/PortfolioShow").then(
          convertWithProtection(queryClient)
        ),
    },
    {
      path: "/portfolios/:id/edit",
      lazy: () =>
        import("./pages/PortfolioEdit").then(
          convertWithProtection(queryClient)
        ),
    },
    // Admin routes (authentication and admin role required)
    {
      path: "/admin/dashboard",
      lazy: () =>
        import("./pages/AdminDashboard").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/users",
      lazy: () =>
        import("./pages/AdminUsers").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/users/create",
      lazy: () =>
        import("./pages/AdminUserCreate").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/users/:id/edit",
      lazy: () =>
        import("./pages/AdminUserEdit").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/users/:id",
      lazy: () =>
        import("./pages/AdminUserShow").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/blogs",
      lazy: () =>
        import("./pages/AdminBlogs").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/blogs/create",
      lazy: () =>
        import("./pages/AdminBlogCreate").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/blogs/:id/edit",
      lazy: () =>
        import("./pages/AdminBlogEdit").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/blogs/:id",
      lazy: () =>
        import("./pages/AdminBlogShow").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/blogs/m/categories",
      lazy: () =>
        import("./pages/AdminBlogCategories").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/blogs/m/tags",
      lazy: () =>
        import("./pages/AdminBlogTags").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/templates",
      lazy: () =>
        import("./pages/AdminTemplates").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/templates/create",
      lazy: () =>
        import("./pages/AdminTemplateCreate").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/templates/guide",
      lazy: () =>
        import("./pages/AdminTemplateGuide").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/templates/:id/edit",
      lazy: () =>
        import("./pages/AdminTemplateEdit").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/templates/:id",
      lazy: () =>
        import("./pages/AdminTemplateShow").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/jobs",
      lazy: () =>
        import("./pages/AdminJobs").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/jobs/create",
      lazy: () =>
        import("./pages/AdminJobCreate").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/jobs/:id/edit",
      lazy: () =>
        import("./pages/AdminJobEdit").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/jobs/:id",
      lazy: () =>
        import("./pages/AdminJobShow").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/jobs/m/companies",
      lazy: () =>
        import("./pages/AdminCompanies").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "/admin/jobs/m/roles",
      lazy: () =>
        import("./pages/AdminJobRoles").then(
          convertWithAdminProtection(queryClient)
        ),
    },
    {
      path: "*",
      lazy: () => import("./pages/NotFound").then(convert(queryClient)),
    },
  ]);
