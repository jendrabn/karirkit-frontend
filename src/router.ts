import { createBrowserRouter } from "react-router";
import type { LoaderFunction, ActionFunction } from "react-router";
import type { QueryClient } from "@tanstack/react-query";
import type { ComponentType } from "react";

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

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
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
      path: "/auth/login",
      lazy: () => import("./pages/Login").then(convert(queryClient)),
    },
    {
      path: "/auth/register",
      lazy: () => import("./pages/Register").then(convert(queryClient)),
    },
    {
      path: "/auth/forgot-password",
      lazy: () => import("./pages/ForgotPassword").then(convert(queryClient)),
    },
    {
      path: "/auth/reset-password",
      lazy: () => import("./pages/ResetPassword").then(convert(queryClient)),
    },
    {
      path: "/auth/verify-otp",
      lazy: () => import("./pages/VerifyOTP").then(convert(queryClient)),
    },
    {
      path: "/dashboard",
      lazy: () => import("./pages/Dashboard").then(convert(queryClient)),
    },
    {
      path: "/profile",
      lazy: () => import("./pages/Profile").then(convert(queryClient)),
    },
    {
      path: "/change-password",
      lazy: () => import("./pages/ChangePassword").then(convert(queryClient)),
    },
    {
      path: "/applications",
      lazy: () => import("./pages/Applications").then(convert(queryClient)),
    },
    {
      path: "/applications/create",
      lazy: () =>
        import("./pages/ApplicationsCreate").then(convert(queryClient)),
    },
    {
      path: "/applications/:id",
      lazy: () =>
        import("./pages/ApplicationsDetail").then(convert(queryClient)),
    },
    {
      path: "/applications/:id/edit",
      lazy: () => import("./pages/ApplicationsEdit").then(convert(queryClient)),
    },
    {
      path: "/application-letters",
      lazy: () =>
        import("./pages/ApplicationLetters").then(convert(queryClient)),
    },
    {
      path: "/application-letters/create",
      lazy: () =>
        import("./pages/ApplicationLettersCreate").then(convert(queryClient)),
    },
    {
      path: "/application-letters/:id",
      lazy: () =>
        import("./pages/ApplicationLettersDetail").then(convert(queryClient)),
    },
    {
      path: "/application-letters/:id/edit",
      lazy: () =>
        import("./pages/ApplicationLettersEdit").then(convert(queryClient)),
    },
    {
      path: "/cvs",
      lazy: () => import("./pages/CVs").then(convert(queryClient)),
    },
    {
      path: "/cvs/create",
      lazy: () => import("./pages/CVsCreate").then(convert(queryClient)),
    },
    {
      path: "/cvs/:id",
      lazy: () => import("./pages/CVsDetail").then(convert(queryClient)),
    },
    {
      path: "/cvs/:id/edit",
      lazy: () => import("./pages/CVsEdit").then(convert(queryClient)),
    },
    {
      path: "/portfolios",
      lazy: () => import("./pages/Portfolios").then(convert(queryClient)),
    },
    {
      path: "/portfolios/create",
      lazy: () => import("./pages/PortfoliosCreate").then(convert(queryClient)),
    },
    {
      path: "/portfolios/:id",
      lazy: () => import("./pages/PortfoliosDetail").then(convert(queryClient)),
    },
    {
      path: "/portfolios/:id/edit",
      lazy: () => import("./pages/PortfoliosEdit").then(convert(queryClient)),
    },
    {
      path: "/my/:username",
      lazy: () => import("./pages/My").then(convert(queryClient)),
    },
    {
      path: "/my/:username/:id",
      lazy: () => import("./pages/MyDetail").then(convert(queryClient)),
    },
    {
      path: "*",
      lazy: () => import("./pages/NotFound").then(convert(queryClient)),
    },
  ]);
