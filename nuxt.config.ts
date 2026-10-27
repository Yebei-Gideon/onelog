import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
  ],

  ssr: false,

  devtools: {
    enabled: true,
  },

  app: {
    baseURL: "/",
  },

  css: ["~/assets/css/main.css"],

  router: {
    options: {
      hashMode: true,
    },
  },

  ignore: ["**/src-tauri/**"],

  devServer: {
    port: 3000,
    host: "0.0.0.0",
  },

  future: {
    compatibilityVersion: 5,
  },

  experimental: {
    payloadExtraction: false,
  },

  compatibilityDate: "2026-06-30",

  vite: {
    clearScreen: false,
    envPrefix: ["NUXT_", "VITE_", "BUN_", "TAURI_"],
    plugins: [
      tailwindcss(),
    ],
    server: {
      strictPort: true,
      watch: {
        ignored: ["**/src-tauri/**"],
      },
    },
  },

  eslint: {
    config: {
      standalone: false,
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
