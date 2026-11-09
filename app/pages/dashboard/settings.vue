<!-- app/pages/dashboard/settings.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { user } = useAuth();
const { platforms, loadPlatforms, deleteCustomPlatform } = useDashboard();

const customPlatforms = computed(() => platforms.value.filter(p => p.isCustom));

onMounted(() => {
  loadPlatforms();
});
</script>

<template>
  <UDashboardPanel id="settings-panel">
    <template #header>
      <UDashboardNavbar title="Account & Security Settings">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-4 sm:p-6 space-y-6 max-w-4xl">
        <!-- User Profile Card -->
        <UCard class="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xs">
          <template #header>
            <h3 class="font-bold text-sm text-neutral-900 dark:text-white">
              User Profile
            </h3>
          </template>

          <div class="flex items-center gap-4">
            <UAvatar
              :src="user?.avatarUrl || undefined"
              :alt="user?.name || user?.email || 'User'"
              size="lg"
              class="bg-primary-500/20 text-primary-500 font-bold shrink-0"
            />
            <div>
              <h4 class="font-bold text-neutral-900 dark:text-white">
                {{ user?.name || 'OneLog User' }}
              </h4>
              <p class="text-xs text-neutral-500">
                {{ user?.email }}
              </p>
              <UBadge color="primary" variant="subtle" size="xs" class="mt-1 rounded-xs">
                Authenticated
              </UBadge>
            </div>
          </div>
        </UCard>

        <!-- Managed Private Custom Platforms -->
        <UCard class="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xs">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-sm text-neutral-900 dark:text-white">
                My Private Custom Platforms
              </h3>
              <UBadge color="neutral" variant="subtle" size="xs" class="rounded-xs">
                {{ customPlatforms.length }} Custom Apps
              </UBadge>
            </div>
          </template>

          <div v-if="customPlatforms.length === 0" class="text-xs text-neutral-500 py-4 text-center">
            You have not created any private platforms yet.
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="p in customPlatforms"
              :key="`custom-${p.id}`"
              class="p-3 border border-neutral-200 dark:border-neutral-800 rounded-xs flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <UIcon :name="p.logo || 'i-lucide-globe'" class="w-5 h-5" :style="{ color: p.color }" />
                <div>
                  <h4 class="font-bold text-xs text-neutral-900 dark:text-white">
                    {{ p.name }}
                  </h4>
                  <p class="text-[11px] text-neutral-400">
                    {{ p.url }}
                  </p>
                </div>
              </div>

              <UButton
                color="error"
                variant="ghost"
                size="xs"
                icon="i-lucide-trash-2"
                @click="deleteCustomPlatform(p.id)"
              >
                Delete
              </UButton>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>