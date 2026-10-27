<script setup lang="ts">
const { icon, ariaLabel, preference, toggleTheme } = useTheme();

// Descriptive text for the tooltip based on the current state
const tooltipText = computed(() => {
  switch (preference.value) {
    case "light":
      return "Switch to dark mode";
    case "dark":
      return "Switch to system theme";
    case "system":
    default:
      return "Switch to light mode";
  }
});

// Register keyboard shortcut: Shift + T
// `usingInput: false` prevents accidental triggering when typing in forms
defineShortcuts({
  shift_t: {
    usingInput: false,
    handler: () => toggleTheme(),
  },
});
</script>

<template>
  <ClientOnly>
    <UTooltip :text="tooltipText" :kbds="['Shift', 'T']">
      <UButton
        color="neutral"
        variant="ghost"
        size="md"
        :aria-label="ariaLabel"
        :icon="icon"
        class="min-h-10 min-w-10 rounded-md border border-neutral-200/80 dark:border-neutral-800/80 hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 cursor-pointer justify-center text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
        @click="toggleTheme($event)"
      />
    </UTooltip>
    <template #fallback>
      <div class="size-10 rounded-md bg-neutral-200/50 dark:bg-neutral-800/50 animate-pulse border border-neutral-200/80 dark:border-neutral-800/80" />
    </template>
  </ClientOnly>
</template>
