<!-- app/components/common/ViewToggle.vue -->
<script setup lang="ts">
const { viewMode, setViewMode } = useViewMode();
</script>

<template>
  <div class="inline-flex items-center p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60">
    <UButton
      :color="viewMode === 'grid' ? 'primary' : 'neutral'"
      :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
      size="xs"
      icon="i-lucide-layout-grid"
      aria-label="Grid view"
      @click="setViewMode('grid')"
    >
      <span class="hidden sm:inline">Grid</span>
    </UButton>

    <UButton
      :color="viewMode === 'list' ? 'primary' : 'neutral'"
      :variant="viewMode === 'list' ? 'solid' : 'ghost'"
      size="xs"
      icon="i-lucide-list"
      aria-label="List view"
      @click="setViewMode('list')"
    >
      <span class="hidden sm:inline">List</span>
    </UButton>
  </div>
</template>
