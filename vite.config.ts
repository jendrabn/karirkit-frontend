import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const rawEnv = loadEnv(mode, process.cwd(), "");
  const apiBaseUrl = rawEnv.VITE_APP_API_URL ?? "";

  const runtimeCaching: any[] = [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-cache",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "gstatic-fonts-cache",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "images-cache",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
  ];

  if (apiBaseUrl) {
    try {
      const parsedApiUrl = new URL(apiBaseUrl);
      const apiPattern = new RegExp(
        `^${parsedApiUrl.origin}${parsedApiUrl.pathname.replace(/\/$/, "")}/.*`,
        "i"
      );

      runtimeCaching.push({
        urlPattern: ({ url }: { url: { href: string } }) => {
          return apiPattern.test(url.href);
        },
        handler: "NetworkFirst",
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
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "favicon.ico",
          "favicon-16x16.png",
          "favicon-32x32.png",
          "apple-touch-icon.png",
          "android-ch192x192.png",
          "android-ch512x512.png",
          "images/**/*",
        ],
        manifest: {
          name: "KarirKit - Platform Manajemen Karir",
          short_name: "KarirKit",
          description:
            "Platform all-in-one untuk mengelola lamaran kerja, membuat CV, surat lamaran, dan portofolio digital",
          theme_color: "#2bb95e",
          background_color: "#ffffff",
          display: "standalone",
          orientation: "portrait",
          scope: "/",
          start_url: "/",
          icons: [
            {
              src: "favicon-16x16.png",
              sizes: "16x16",
              type: "image/png",
            },
            {
              src: "favicon-32x32.png",
              sizes: "32x32",
              type: "image/png",
            },
            {
              src: "images/pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: "android-ch192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "images/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "android-ch512x512.png",
              sizes: "512x512",
              type: "image/png",
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
