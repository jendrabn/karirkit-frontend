import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA, cachePreset } from "vite-plugin-pwa";

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
          theme_color: "#2bb95e",
          background_color: "#ffffff",
          display: "standalone",
          orientation: "portrait",
          scope: "/",
          start_url: "/",
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
            },
            {
              src: "images/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
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
