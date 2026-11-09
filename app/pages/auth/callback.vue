<!-- app/pages/auth/callback.vue -->
<script setup lang="ts">
definePageMeta({
  layout: false,
});

const route = useRoute();
const router = useRouter();
const { saveAuthSession } = useAuth();
const config = useRuntimeConfig();

onMounted(async () => {
  const accessToken = String(route.query.accessToken || "");
  const refreshToken = String(route.query.refreshToken || "");
  const sessionId = String(route.query.sessionId || "");

  if (accessToken && refreshToken && sessionId) {
    try {
      const user = await $fetch(`${config.public.apiBaseUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      saveAuthSession({
        user,
        tokens: { accessToken, refreshToken, sessionId },
      });

      // Remove tokens from the URL before navigating so they are not retained
      // in browser history or copied into logs.
      window.history.replaceState({}, document.title, `${window.location.origin}${window.location.pathname}#/auth/callback`);

      // Close popup if running inside a Tauri webview window
      if ((window as typeof window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__) {
        try {
          const { getCurrentWindow } = await import("@tauri-apps/api/window");
          const currentWindow = getCurrentWindow();
          if (currentWindow.label.startsWith("oauth_")) {
            await currentWindow.close();
            return;
          }
        }
        catch (tauriErr) {
          console.warn("[TAURI OAUTH WINDOW CLOSE WARN]", tauriErr);
        }
      }

      await router.push("/dashboard");
    }
    catch (err) {
      console.error("[OAUTH CALLBACK ERROR]", err);
      await router.push("/login?error=oauth_failed");
    }
  }
  else {
    await router.push("/login?error=oauth_failed");
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
    <div class="flex flex-col items-center space-y-3">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary-500" />
      <p class="text-sm font-medium text-neutral-400">
        Authenticating session...
      </p>
    </div>
  </div>
</template>