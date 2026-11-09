<!-- app/pages/dashboard/analytics.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { stats, platforms } = useDashboard();
</script>

<template>
  <UDashboardPanel id="analytics-panel">
    <template #header>
      <UDashboardNavbar title="Workspace Analytics">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-4 sm:p-6 space-y-6">
        <div>
          <h2 class="text-lg font-bold text-neutral-900 dark:text-white">
            Usage Metrics & Application Insights
          </h2>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            Overview of configured integrations and active launchpad shortcuts.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <UCard
            v-for="stat in stats"
            :key="stat.label"
            class="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xs"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs text-neutral-500 font-medium">
                  {{ stat.label }}
                </p>
                <p class="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                  {{ stat.value }}
                </p>
              </div>
              <UIcon :name="stat.icon" class="w-6 h-6" :class="stat.color" />
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>