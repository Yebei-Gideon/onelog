<!-- app/pages/login.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const { login, navigateToDashboardIfLoggedIn } = useAuth();
navigateToDashboardIfLoggedIn();

const route = useRoute();

const form = reactive({
  email: "",
  password: "",
  rememberMe: false,
});

const isLoading = ref(false);
const errorMessage = ref(
  route.query.error === "oauth_failed"
    ? "OAuth sign-in was canceled or failed. Please try again."
    : "",
);
const showPassword = ref(false);

async function handleLogin() {
  errorMessage.value = "";
  isLoading.value = true;

  try {
    await login({
      email: form.email,
      password: form.password,
      rememberMe: form.rememberMe,
    });
  }
  catch (err: any) {
    console.error("[LOGIN PAGE] Form submission error:", err);
    errorMessage.value = err?.data?.statusMessage || err?.message || "Invalid email or password.";
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <UCard class="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-xs rounded-sm transition-colors duration-200">
      <template #header>
        <div class="text-left space-y-1.5 py-1">
          <UBadge
            color="primary"
            variant="subtle"
            size="xs"
            class="mb-1 font-mono text-[10px] uppercase tracking-wider rounded-xs"
          >
            Welcome Back
          </UBadge>
          <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Sign in to OneLog
          </h1>
          <p class="text-xs text-neutral-600 dark:text-neutral-400">
            Access your social, developer, and professional launchpad
          </p>
        </div>
      </template>

      <div class="space-y-5">
        <!-- OAuth Social Identity Provider Buttons -->
        <AuthSocialAuthButtons />

        <!-- Divider -->
        <div class="relative flex items-center justify-center my-4">
          <div class="w-full border-t border-neutral-200 dark:border-neutral-800" />
          <span class="absolute bg-white dark:bg-neutral-950 px-3 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            or continue with
          </span>
        </div>

        <!-- Accessible Alert Banner -->
        <UAlert
          v-if="errorMessage"
          color="error"
          variant="subtle"
          title="Sign In Error"
          :description="errorMessage"
          icon="i-lucide-alert-circle"
          class="text-xs rounded-xs"
          role="alert"
        />

        <!-- Credentials Login Form -->
        <form class="space-y-4" @submit.prevent="handleLogin">
          <UFormField
            label="Email address"
            name="email"
            required
          >
            <UInput
              id="login-email"
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              icon="i-lucide-mail"
              size="md"
              required
              autocomplete="email"
              class="w-full rounded-xs"
            />
          </UFormField>

          <UFormField
            label="Password"
            name="password"
            required
          >
            <template #label>
              <div class="flex items-center justify-between w-full">
                <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Password</span>
                <NuxtLink to="#" class="text-[11px] text-primary-600 dark:text-primary-400 hover:underline font-medium rounded-xs">
                  Forgot password?
                </NuxtLink>
              </div>
            </template>

            <UInput
              id="login-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              icon="i-lucide-lock"
              size="md"
              required
              autocomplete="current-password"
              class="w-full rounded-xs"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  type="button"
                  class="rounded-xs"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <div class="flex items-center justify-between pt-1">
            <div class="flex items-center gap-2">
              <UCheckbox
                id="rememberMe"
                v-model="form.rememberMe"
                class="rounded-xs"
              />
              <label for="rememberMe" class="text-xs font-medium text-neutral-600 dark:text-neutral-400 cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>
          </div>

          <UButton
            type="submit"
            color="primary"
            block
            size="lg"
            :loading="isLoading"
            icon="i-lucide-log-in"
            trailing
            class="mt-2 font-bold rounded-xs shadow-xs"
          >
            Sign In
          </UButton>
        </form>
      </div>

      <template #footer>
        <p class="text-center text-xs text-neutral-600 dark:text-neutral-400">
          Don't have an account yet?
          <NuxtLink to="/signup" class="font-semibold text-primary-600 dark:text-primary-400 hover:underline rounded-xs ml-1">
            Create free account
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
