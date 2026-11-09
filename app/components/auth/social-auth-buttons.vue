<!-- app/components/auth/social-auth-buttons.vue -->
<script setup lang="ts">
type Provider = {
  label: string;
  value: string;
  icon: string;
  endpoint: string;
  brandColor: string;
};

const config = useRuntimeConfig();

const providers: Provider[] = [
  {
    label: "Google",
    value: "google",
    icon: "i-simple-icons-google",
    endpoint: `${config.public.apiBaseUrl}/auth/google`,
    brandColor: "#EA4335",
  },
];

const selectedProvider = ref<Provider>(providers[0] as Provider);
async function handleSocialLogin(e?: Event) {
  if (e)
    e.preventDefault();
  if (!selectedProvider.value)
    return;

  const targetUrl = selectedProvider.value.endpoint;
  console.log(`[SOCIAL AUTH] Redirecting to ${selectedProvider.value.label} via NestJS backend`);

  // Keep the OAuth callback in the main Tauri webview so its session storage
  // remains available after the provider redirects back to the app.
  window.location.href = targetUrl;
}
</script>

<template>
  <div class="space-y-3">
    <UButton
      type="button"
      color="neutral"
      variant="outline"
      block
      size="md"
      icon="i-lucide-arrow-right"
      trailing
      class="font-bold rounded-xs border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 shadow-xs"
      @click="handleSocialLogin"
    >
      <template #leading>
        <UIcon
          v-if="selectedProvider"
          :name="selectedProvider.icon"
          class="w-4 h-4 shrink-0"
          :style="{ color: selectedProvider.brandColor }"
        />
      </template>
      <span>Continue with {{ selectedProvider?.label }}</span>
    </UButton>
  </div>
</template>
