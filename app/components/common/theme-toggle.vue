<!-- app/components/common/theme-toggle.vue -->
<script setup lang="ts">
const { isDark, isMounted, toggleTheme } = useTheme();
</script>

<template>
  <ClientOnly>
    <UButton
      v-if="isMounted"
      :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
      color="neutral"
      variant="ghost"
      size="sm"
      aria-label="Toggle theme"
      @click="toggleTheme"
    />
    <template #fallback>
      <div class="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
    </template>
  </ClientOnly>
</template>
