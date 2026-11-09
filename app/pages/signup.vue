<!-- app/pages/signup.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const { register, navigateToDashboardIfLoggedIn } = useAuth();
navigateToDashboardIfLoggedIn();

const form = reactive({
  name: "",
  email: "",
  password: "",
  terms: false,
});

const isLoading = ref(false);
const errorMessage = ref("");
const showPassword = ref(false);

async function handleSignup() {
  errorMessage.value = "";

  if (!form.terms) {
    errorMessage.value = "Please accept the Terms of Service to continue.";
    return;
  }

  isLoading.value = true;

  try {
    await register({
      name: form.name,
      email: form.email,
      password: form.password,
    });
  }
  catch (err: any) {
    console.error("[SIGNUP PAGE] Form submission error:", err);
    errorMessage.value = err?.data?.statusMessage || err?.message || "Registration failed. Please try again.";
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
            Get Started
          </UBadge>
          <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Create your OneLog account
          </h1>
          <p class="text-xs text-neutral-600 dark:text-neutral-400">
            Connect all your social networks into a central launchpad
          </p>
        </div>
      </template>

      <div class="space-y-5">
        <!-- Social OAuth Buttons -->
        <AuthSocialAuthButtons />

        <div class="relative flex items-center justify-center my-4">
          <div class="w-full border-t border-neutral-200 dark:border-neutral-800" />
          <span class="absolute bg-white dark:bg-neutral-950 px-3 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            or register with email
          </span>
        </div>

        <UAlert
          v-if="errorMessage"
          color="error"
          variant="subtle"
          title="Registration Failed"
          :description="errorMessage"
          icon="i-lucide-alert-circle"
          class="text-xs rounded-xs"
          role="alert"
        />

        <form class="space-y-4" @submit.prevent="handleSignup">
          <UFormField
            label="Full Name"
            name="name"
            required
          >
            <UInput
              id="signup-name"
              v-model="form.name"
              type="text"
              placeholder="Jane Doe"
              icon="i-lucide-user"
              size="md"
              required
              autocomplete="name"
              class="w-full rounded-xs"
            />
          </UFormField>

          <UFormField
            label="Email address"
            name="email"
            required
          >
            <UInput
              id="signup-email"
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
            <UInput
              id="signup-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              icon="i-lucide-lock"
              size="md"
              required
              autocomplete="new-password"
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

          <div class="flex items-start gap-2 pt-1">
            <input
              id="terms"
              v-model="form.terms"
              type="checkbox"
              class="mt-1 size-4 shrink-0 cursor-pointer accent-primary-600"
            >
            <label
              for="terms"
              class="text-xs text-neutral-600 dark:text-neutral-400 leading-normal cursor-pointer select-none"
            >
              I agree to the <a href="/terms" class="text-primary-600 dark:text-primary-400 font-medium hover:underline rounded-xs">Terms of Service</a> and <a href="/privacy" class="text-primary-600 dark:text-primary-400 font-medium hover:underline rounded-xs">Privacy Policy</a>.
            </label>
          </div>

          <UButton
            type="submit"
            color="primary"
            block
            size="lg"
            :loading="isLoading"
            icon="i-lucide-arrow-right"
            trailing
            class="mt-2 font-bold rounded-xs shadow-xs"
          >
            Create Account
          </UButton>
        </form>
      </div>

      <template #footer>
        <p class="text-center text-xs text-neutral-600 dark:text-neutral-400">
          Already have an account?
          <NuxtLink to="/login" class="font-semibold text-primary-600 dark:text-primary-400 hover:underline rounded-xs ml-1">
            Sign in
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
