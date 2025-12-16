export const paths = {
  home: {
    getHref: () => "/",
  },

  blog: {
    list: {
      getHref: () => "/blog",
    },
    detail: {
      getHref: (slug: string) => `/blog/${slug}`,
    },
  },

  auth: {
    login: {
      getHref: (redirectTo?: string | null) =>
        `/auth/login${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
        }`,
    },
    register: {
      getHref: (redirectTo?: string | null) =>
        `/auth/register${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
        }`,
    },
    forgotPassword: {
      getHref: () => "/auth/forgot-password",
    },
    resetPassword: {
      getHref: () => "/auth/reset-password",
    },
    verifyOtp: {
      getHref: () => "/auth/verify-otp",
    },
  },

  dashboard: {
    getHref: () => "/dashboard",
  },

  profile: {
    getHref: () => "/profile",
    changePassword: {
      getHref: () => "/change-password",
    },
  },

  applications: {
    list: {
      getHref: () => "/applications",
    },
    create: {
      getHref: () => "/applications/create",
    },
    edit: {
      getHref: (id: string) => `/applications/${id}/edit`,
    },
    detail: {
      getHref: (id: string) => `/applications/${id}`,
    },
  },

  applicationLetters: {
    list: {
      getHref: () => "/application-letters",
    },
    create: {
      getHref: () => "/application-letters/create",
    },
    edit: {
      getHref: (id: string) => `/application-letters/${id}/edit`,
    },
    detail: {
      getHref: (id: string) => `/application-letters/${id}`,
    },
  },

  cvs: {
    list: {
      getHref: () => "/cvs",
    },
    create: {
      getHref: () => "/cvs/create",
    },
    edit: {
      getHref: (id: string) => `/cvs/${id}/edit`,
    },
    detail: {
      getHref: (id: string) => `/cvs/${id}`,
    },
  },

  portfolios: {
    list: {
      getHref: () => "/portfolios",
    },
    create: {
      getHref: () => "/portfolios/create",
    },
    edit: {
      getHref: (id: string) => `/portfolios/${id}/edit`,
    },
    detail: {
      getHref: (id: string) => `/portfolios/${id}`,
    },
  },

  publicPortfolio: {
    list: {
      getHref: (username: string) => `/my/${username}`,
    },
    detail: {
      getHref: (username: string, id: string) => `/my/${username}/${id}`,
    },
  },
} as const;
