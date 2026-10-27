import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@vueuse/nuxt/module",
    "nuxt-auth-utils",
  ],

  ssr: false,

  devtools: {
    enabled: true,
  },

  app: {
    baseURL: "/",
    head: {
      title: "OneLog — Your Central Social Media Launchpad",
      meta: [
        { name: "description", content: "Access, manage, and launch all your social media platforms from a unified dashboard." },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
    },
  },

  css: ["~/assets/css/main.css"],

  router: {
    options: {
      hashMode: true,
    },
  },

  colorMode: {
    preference: "system",
    fallback: "dark",
    classSuffix: "",
  },

  runtimeConfig: {
    tursoDatabaseUrl: process.env.TURSO_DATABASE_URL,
    tursoAuthToken: process.env.TURSO_AUTH_TOKEN,

    session: {
      maxAge: 60 * 15,
      password: process.env.NUXT_SESSION_PASSWORD || "onelog-dev-session-secret-must-be-at-least-32-chars-long",
    },

    oauth: {
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
      },
      github: {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
      },
      facebook: {
        clientId: process.env.NUXT_OAUTH_FACEBOOK_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_FACEBOOK_CLIENT_SECRET,
      },
      twitter: {
        clientId: process.env.NUXT_OAUTH_TWITTER_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_TWITTER_CLIENT_SECRET,
      },
      discord: {
        clientId: process.env.NUXT_OAUTH_DISCORD_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_DISCORD_CLIENT_SECRET,
      },
      linkedin: {
        clientId: process.env.NUXT_OAUTH_LINKEDIN_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_LINKEDIN_CLIENT_SECRET,
      },
      apple: {
        clientId: process.env.NUXT_OAUTH_APPLE_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_APPLE_CLIENT_SECRET,
      },
    },
  },

  ignore: ["**/src-tauri/**"],

  devServer: {
    port: 3000,
    host: "0.0.0.0",
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
