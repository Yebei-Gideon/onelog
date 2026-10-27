<!-- app/components/common/app-header.vue -->
<script setup lang="ts">
import { useWindowScroll } from "@vueuse/core";

const { y } = useWindowScroll();
const isScrolled = computed(() => y.value > 15);
const { user } = useAuth();
</script>

<template>
  <header
    class="sticky top-0 z-50 transition-all duration-300 border-b"
    :class="[
      isScrolled
        ? 'bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-neutral-200/80 dark:border-neutral-800/80 shadow-xs'
        : 'bg-transparent border-transparent',
    ]"
  >
    <UContainer class="h-16 sm:h-20 flex items-center justify-between gap-3">
      <!-- Brand Logo -->
      <NuxtLink to="/" class="focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm shrink-0">
        <CommonAppLogo size="md" />
      </NuxtLink>

      <!-- Right Header Actions -->
      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
        <CommonThemeToggle />

        <!-- Logged In State -->
        <template v-if="user">
          <UButton
            to="/dashboard"
            color="primary"
            variant="solid"
            size="sm"
            icon="i-lucide-layout-dashboard"
            trailing
            class="font-bold rounded-sm shadow-xs whitespace-nowrap"
          >
            Dashboard
          </UButton>
        </template>

        <!-- Logged Out State -->
        <template v-else>
          <UButton
            to="/login"
            variant="ghost"
            color="neutral"
            size="sm"
            icon="i-lucide-log-in"
            trailing
            class="font-semibold rounded-sm whitespace-nowrap"
          >
            Log in
          </UButton>
          <UButton
            to="/signup"
            color="primary"
            variant="solid"
            size="sm"
            icon="i-lucide-arrow-right"
            trailing
            class="font-bold rounded-sm shadow-xs whitespace-nowrap"
          >
            Get Started
          </UButton>
        </template>
      </div>
    </UContainer>
  </header>
</template>
