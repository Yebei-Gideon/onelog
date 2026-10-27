<!-- app/components/common/app-logo.vue -->
<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: "sm" | "md" | "lg" | "xl";
    showText?: boolean;
  }>(),
  {
    size: "md",
    showText: true,
  },
);
</script>

<template>
  <div class="inline-flex items-center font-bold group select-none shrink-0">
    <!-- Flexible Responsive Logo Container -->
    <div
      class="relative flex items-center shrink-0 transition-all duration-200"
      :class="[
        size === 'sm'
          ? 'h-7 sm:h-8'
          : size === 'lg'
            ? 'h-10 sm:h-12'
            : size === 'xl'
              ? 'h-12 sm:h-14'
              : 'h-9 sm:h-11',
      ]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="showText ? '0 0 125 28' : '0 0 24 28'"
        class="h-full w-auto block overflow-visible"
        fill="none"
      >
        <defs>
          <!-- Animated Gradient Definition for Text -->
          <linearGradient
            id="text-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" class="gradient-stop-1" />
            <stop offset="50%" class="gradient-stop-2" />
            <stop offset="100%" class="gradient-stop-3" />
          </linearGradient>
        </defs>

        <!-- Stack Icon Group -->
        <g transform="translate(0, 2)">
          <!-- Top Layer -->
          <path d="M12 2L2 7L12 12L22 7L12 2Z" class="animate-stack-top" />

          <!-- Middle Layer -->
          <path
            d="M2 12L12 17L22 12"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="animate-stack-mid"
          />

          <!-- Bottom Layer -->
          <path
            d="M2 17L12 22L22 17"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="animate-stack-bottom"
          />
        </g>

        <!-- Animated Brand Title -->
        <text
          v-if="showText"
          x="32"
          y="20"
          class="brand-text font-bold"
          font-size="20"
          font-weight="bold"
        >OneLog</text>
      </svg>
    </div>
  </div>
</template>
