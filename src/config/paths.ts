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

  jobs: {
    list: {
      getHref: () => "/jobs",
    },
    detail: {
      getHref: (slug: string) => `/jobs/${slug}`,
    },
    bookmarks: {
      getHref: () => "/bookmarks",
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
  account: {
    profile: {
      getHref: () => "/profile",
    },
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
      getHref: (username: string) => `/u/${username}`,
    },
    detail: {
      getHref: (username: string, id: string) => `/u/${username}/${id}`,
    },
  },

  // Route Admin
  admin: {
    dashboard: {
      getHref: () => "/admin/dashboard",
    },
    users: {
      list: {
        getHref: () => "/admin/users",
      },
      create: {
        getHref: () => "/admin/users/create",
      },
      edit: {
        getHref: (id: string) => `/admin/users/${id}/edit`,
      },
      detail: {
        getHref: (id: string) => `/admin/users/${id}`,
      },
    },
    blogs: {
      list: {
        getHref: () => "/admin/blogs",
      },
      create: {
        getHref: () => "/admin/blogs/create",
      },
      edit: {
        getHref: (id: string) => `/admin/blogs/${id}/edit`,
      },
      detail: {
        getHref: (id: string) => `/admin/blogs/${id}`,
      },
      categories: {
        getHref: () => "/admin/blogs/m/categories",
      },
      tags: {
        getHref: () => "/admin/blogs/m/tags",
      },
    },
    templates: {
      list: {
        getHref: () => "/admin/templates",
      },
      create: {
        getHref: () => "/admin/templates/create",
      },
      edit: {
        getHref: (id: string) => `/admin/templates/${id}/edit`,
      },
      detail: {
        getHref: (id: string) => `/admin/templates/${id}`,
      },
      guide: {
        getHref: () => "/admin/templates/guide",
      },
    },
    jobs: {
      list: {
        getHref: () => "/admin/jobs",
      },
      create: {
        getHref: () => "/admin/jobs/create",
      },
      edit: {
        getHref: (id: string) => `/admin/jobs/${id}/edit`,
      },
      detail: {
        getHref: (id: string) => `/admin/jobs/${id}`,
      },
      companies: {
        getHref: () => "/admin/jobs/m/companies",
      },
      roles: {
        getHref: () => "/admin/jobs/m/roles",
      },
    },
  },
} as const;
