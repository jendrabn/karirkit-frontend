import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA, cachePreset } from "vite-plugin-pwa";

const brandTheme = {
  primary: "#25724F",
  splash: "#FAF7F1",
} as const;

const chunkGroups = [
  {
    name: "react-vendor",
    patterns: [
      "/node_modules/react/",
      "/node_modules/react-dom/",
      "/node_modules/react-router/",
      "/node_modules/react-error-boundary/",
      "/node_modules/react-helmet-async/",
      "/node_modules/@react-oauth/google/",
    ],
  },
  {
    name: "editor-vendor",
    patterns: [
      "/node_modules/@tiptap/",
      "/node_modules/quill/",
      "/node_modules/prosemirror-",
    ],
  },
  {
    name: "charts-vendor",
    patterns: ["/node_modules/recharts/", "/node_modules/d3-"],
  },
  {
    name: "ui-vendor",
    patterns: [
      "/node_modules/@radix-ui/",
      "/node_modules/@base-ui/react/",
      "/node_modules/cmdk/",
      "/node_modules/sonner/",
      "/node_modules/input-otp/",
      "/node_modules/next-themes/",
      "/node_modules/vaul/",
      "/node_modules/react-day-picker/",
      "/node_modules/react-resizable-panels/",
      "/node_modules/react-icons/",
    ],
  },
  {
    name: "date-vendor",
    patterns: ["/node_modules/date-fns/", "/node_modules/dayjs/"],
  },
  {
    name: "markdown-vendor",
    patterns: [
      "/node_modules/react-markdown/",
      "/node_modules/remark-gfm/",
    ],
  },
  {
    name: "icons-vendor",
    patterns: ["/node_modules/lucide-react/", "/node_modules/react-icons/"],
  },
  {
    name: "utility-vendor",
    patterns: [
      "/node_modules/axios/",
      "/node_modules/class-variance-authority/",
      "/node_modules/clsx/",
      "/node_modules/@tanstack/react-query/",
      "/node_modules/@tanstack/react-query-devtools/",
      "/node_modules/react-hook-form/",
      "/node_modules/@hookform/resolvers/",
      "/node_modules/zod/",
      "/node_modules/tailwind-merge/",
      "/node_modules/embla-carousel-react/",
    ],
  },
];

export default defineConfig(({ mode }) => {
  const rawEnv = loadEnv(mode, process.cwd(), "");
  const apiBaseUrl = rawEnv.VITE_APP_API_URL ?? "";

  const runtimeCaching = [
    ...cachePreset,
    {
      urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/i,
      handler: "CacheFirst" as const,
      options: {
        cacheName: "images-cache",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ];

  if (apiBaseUrl) {
    try {
      const parsedApiUrl = new URL(apiBaseUrl);
      const apiPathname = parsedApiUrl.pathname.replace(/\/$/, "") || "/";

      runtimeCaching.push({
        urlPattern: new RegExp(
          `^${parsedApiUrl.origin}${apiPathname}/.*`,
          "i"
        ),
        handler: "NetworkFirst" as const,
        options: {
          cacheName: "api-cache",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 5,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      });
    } catch {
      // ignore invalid URL
    }
  }

  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) {
              return;
            }

            const matchedGroup = chunkGroups.find((group) =>
              group.patterns.some((pattern) => id.includes(pattern))
            );

            return matchedGroup?.name;
          },
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "apple-touch-icon.png"],
        manifest: {
          name: "KarirKit - Platform Manajemen Karir",
          short_name: "KarirKit",
          description:
            "Platform all-in-one untuk mengelola lamaran kerja, membuat CV, surat lamaran, dan portofolio digital",
          theme_color: brandTheme.primary,
          background_color: brandTheme.splash,
          display: "standalone",
          orientation: "portrait",
          scope: "/",
          start_url: "/",
          categories: ["business", "productivity", "education"],
          icons: [
            {
              src: "favicon-32x32.png",
              sizes: "32x32",
              type: "image/png",
            },
            {
              src: "images/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "images/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "images/maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching,
        },
        devOptions: {
          enabled: false,
          suppressWarnings: true,
          type: "module",
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
