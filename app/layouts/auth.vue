<!-- app/layouts/auth.vue -->
<script setup lang="ts">
const route = useRoute();
const currentYear = new Date().getFullYear();

// Check if current route is login or signup
const isLoginPage = computed(() => route.path.includes("login"));
</script>

<template>
  <div class="min-h-screen w-full flex flex-col justify-between bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 relative overflow-hidden antialiased selection:bg-primary-500/20 selection:text-primary-500">
    <!-- Ambient Radial Glow Accents -->
    <div
      class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[500px] h-[300px] bg-primary-500/10 dark:bg-primary-500/15 blur-[140px] rounded-full pointer-events-none"
      aria-hidden="true"
    />

    <!-- Top Navigation Bar -->
    <header class="w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md">
      <UContainer class="h-16 flex items-center justify-between shrink-0 gap-2">
        <!-- Brand & Home Navigation -->
        <div class="flex items-center gap-2.5 sm:gap-3">
          <NuxtLink
            to="/"
            class="focus-visible:outline-2 focus-visible:outline-primary-500 rounded-xs shrink-0"
            aria-label="OneLog homepage"
          >
            <CommonAppLogo size="md" />
          </NuxtLink>

          <!-- Divider -->
          <div class="h-3.5 w-px bg-neutral-200 dark:bg-neutral-800" aria-hidden="true" />

          <!-- Home Link (Always visible on mobile & desktop) -->
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-primary-500 rounded-xs"
          >
            <UIcon name="i-lucide-arrow-left" class="size-3.5 shrink-0" />
            <span>Home</span>
          </NuxtLink>
        </div>

        <!-- Contextual Auth Switcher & Theme Toggle -->
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <span class="text-xs text-neutral-500 dark:text-neutral-400 hidden md:inline">
            {{ isLoginPage ? "Don't have an account?" : "Already have an account?" }}
          </span>

          <NuxtLink
            :to="isLoginPage ? '/signup' : '/login'"
            class="text-xs font-medium px-3 py-1.5 rounded-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 transition-colors focus-visible:outline-2 focus-visible:outline-primary-500 shrink-0"
          >
            {{ isLoginPage ? "Sign up" : "Log in" }}
          </NuxtLink>

          <CommonThemeToggle />
        </div>
      </UContainer>
    </header>

    <!-- Main Content Slot -->
    <main class="flex-1 flex items-center justify-center p-4 sm:px-6 lg:px-8 my-auto w-full">
      <div class="w-full max-w-md mx-auto">
        <slot />
      </div>
    </main>

    <!-- Minimal Auth Footer -->
    <footer class="w-full border-t border-neutral-200/80 dark:border-neutral-800/80 bg-white/50 dark:bg-neutral-950/50 py-6">
      <UContainer class="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
        <p>© {{ currentYear }} OneLog. All rights reserved.</p>

        <nav class="flex items-center gap-4 font-medium" aria-label="Legal links">
          <NuxtLink
            to="#"
            class="hover:text-neutral-900 dark:hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-primary-500 rounded-xs"
          >
            Privacy Policy
          </NuxtLink>
          <NuxtLink
            to="#"
            class="hover:text-neutral-900 dark:hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-primary-500 rounded-xs"
          >
            Terms of Service
          </NuxtLink>
        </nav>
      </UContainer>
    </footer>
  </div>
</template>
