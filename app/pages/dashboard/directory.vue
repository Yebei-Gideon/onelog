<!-- app/pages/dashboard/directory.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const {
  isLoading,
  searchQuery,
  isAddModalOpen,
  filteredPlatforms,
  categoryOptions,
  loadPlatforms,
  launchPlatform,
} = useDashboard();

onMounted(() => {
  loadPlatforms();
});
</script>

<template>
  <UDashboardPanel id="directory-panel">
    <template #header>
      <UDashboardNavbar title="Platform Directory">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search directory..."
            size="sm"
            class="w-48 sm:w-64 rounded-xs"
          />

          <UButton
            color="primary"
            variant="solid"
            size="sm"
            icon="i-lucide-plus"
            class="font-bold rounded-xs shadow-xs"
            @click="isAddModalOpen = true"
          >
            Add Custom Platform
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-4 sm:p-6 space-y-4">
        <div>
          <h2 class="text-lg font-bold text-neutral-900 dark:text-white">
            Available Platforms & Integration Directory
          </h2>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            Browse public directory applications or add custom private endpoints.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard
            v-for="p in filteredPlatforms"
            :key="`dir-${p.id}`"
            class="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xs"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <UIcon :name="p.logo || 'i-lucide-globe'" class="w-7 h-7" :style="{ color: p.color }" />
                <div>
                  <h3 class="font-bold text-sm text-neutral-900 dark:text-white">
                    {{ p.name }}
                  </h3>
                  <span class="text-[10px] text-neutral-500 font-mono">{{ p.category?.name }}</span>
                </div>
              </div>
              <UBadge v-if="p.isCustom" color="warning" variant="subtle" size="xs" class="rounded-xs">
                Private
              </UBadge>
            </div>

            <p class="text-xs text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2">
              {{ p.description || p.url }}
            </p>

            <template #footer>
              <div class="flex justify-end">
                <UButton
                  color="neutral"
                  variant="outline"
                  size="xs"
                  icon="i-lucide-external-link"
                  class="rounded-xs font-semibold"
                  @click="launchPlatform(p.url)"
                >
                  Open Endpoint
                </UButton>
              </div>
            </template>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <DashboardAddPlatformModal
    v-model:open="isAddModalOpen"
    :categories="categoryOptions"
    @created="loadPlatforms"
  />
</template>