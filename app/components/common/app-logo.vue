<!-- app/components/common/app-logo.vue -->
<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: "sm" | "md" | "lg";
    showText?: boolean;
  }>(),
  {
    size: "md",
    showText: true,
  },
);
</script>

<template>
  <div class="inline-flex items-center gap-2 font-bold group select-none shrink-0">
    <!-- Animated Transparent Stack Icon -->
    <div
      class="relative flex items-center justify-center shrink-0"
      :class="[
        size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-10 h-10' : 'w-8.5 h-8.5',
      ]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full overflow-visible"
      >
        <!-- Top Stack Layer -->
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          class="fill-primary-500 animate-stack-top"
        />
        <!-- Middle Stack Layer -->
        <path
          d="M2 12L12 17L22 12"
          class="stroke-neutral-800 dark:stroke-neutral-200 animate-stack-mid"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <!-- Bottom Stack Layer -->
        <path
          d="M2 17L12 22L22 17"
          class="stroke-primary-500/80 dark:stroke-primary-400/80 animate-stack-bottom"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <!-- Dynamic Brand Title (Hidden on small mobile screens) -->
    <span
      v-if="showText"
      class="hidden sm:inline-block font-extrabold tracking-tight text-neutral-900 dark:text-white transition-colors duration-200"
      :class="[
        size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl',
      ]"
    >
      One<span class="text-primary-500">Log</span>
    </span>
  </div>
</template>
