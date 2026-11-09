<!-- app/pages/dashboard/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { activeWorkspace, addPlatformToWorkspace } = useWorkspaceTabs();
const { load: loadAccounts, forPlatform, addAccount, touchAccount } = usePlatformSessions();
const {
  launchPlatform: openPlatform,
  activeView,
  isViewerOpen,
  closeActiveViewer,
} = usePlatformLauncher();
const {
  isLoading,
  searchQuery,
  selectedCategory,
  viewMode,
  isAddModalOpen,
  categoryOptions,
  filteredPlatforms,
  stats,
  loadPlatforms,
  launchPlatform,
} = useDashboard();

onMounted(() => {
  loadAccounts();
  loadPlatforms();
});

function accountsFor(platformId: string) {
  return activeWorkspace.value ? forPlatform(platformId, activeWorkspace.value.id).value : [];
}

async function launch(platform: { id: string; slug: string; name: string; url: string; logo?: string }, account?: { id: string; partitionId: string }) {
  if (!activeWorkspace.value)
    return;
  const selected = account || addAccount(platform.id, activeWorkspace.value.id, "Account 1");
  touchAccount(selected.id);
  await addPlatformToWorkspace(activeWorkspace.value.id, platform.id, platform.url);
  await openPlatform({
    platformSlug: platform.slug,
    platformName: platform.name,
    targetUrl: platform.url,
    workspaceId: activeWorkspace.value.id,
    partitionId: selected.partitionId,
    icon: platform.logo,
  });
}
</script>

<template>
  <div
    v-if="isViewerOpen"
    class="fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-950"
  >
    <div class="flex min-w-0 items-center gap-2">
      <UIcon :name="activeView?.icon || 'i-lucide-globe-2'" class="h-4 w-4 shrink-0" />
      <span class="truncate text-sm font-semibold">{{ activeView?.name }}</span>
    </div>
    <UButton size="xs" color="neutral" variant="outline" icon="i-lucide-x" @click="closeActiveViewer">
      Back to workspace
    </UButton>
  </div>
  <UDashboardPanel id="launchpad-main-panel">
    <template #header>
      <UDashboardNavbar
        :title="`${activeWorkspace?.name || 'Launchpad'}`"
        badge="Operational"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search platforms..."
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
            Add Custom App
          </UButton>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar class="justify-between border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 py-2 bg-neutral-50/50 dark:bg-neutral-900/30">
        <template #left>
          <div class="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
            <UButton
              v-for="cat in categoryOptions"
              :key="cat.value"
              :color="selectedCategory === cat.value ? 'primary' : 'neutral'"
              :variant="selectedCategory === cat.value ? 'solid' : 'subtle'"
              size="xs"
              :icon="cat.icon"
              class="rounded-xs shrink-0 font-medium"
              @click="selectedCategory = cat.value"
            >
              {{ cat.label }}
            </UButton>
          </div>
        </template>

        <template #right>
          <div class="flex items-center gap-1">
            <UButton
              color="neutral"
              :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
              size="xs"
              icon="i-lucide-grid"
              aria-label="Grid View"
              class="rounded-xs"
              @click="viewMode = 'grid'"
            />
            <UButton
              color="neutral"
              :variant="viewMode === 'list' ? 'solid' : 'ghost'"
              size="xs"
              icon="i-lucide-list"
              aria-label="List View"
              class="rounded-xs"
              @click="viewMode = 'list'"
            />
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="p-4 sm:p-6 space-y-6">
        <!-- Stats Summary Bar -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <UCard
            v-for="stat in stats"
            :key="stat.label"
            class="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-2xs rounded-xs"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  {{ stat.label }}
                </p>
                <USkeleton v-if="isLoading" class="w-16 h-7 mt-1 rounded-xs" />
                <p v-else class="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-0.5">
                  {{ stat.value }}
                </p>
              </div>

              <div class="p-2.5 rounded-xs bg-neutral-100 dark:bg-neutral-900">
                <UIcon :name="stat.icon" class="w-5 h-5" :class="stat.color" />
              </div>
            </div>
          </UCard>
        </div>

        <!-- Section Heading -->
        <div class="flex items-center justify-between pt-2">
          <div>
            <h2 class="text-lg font-bold text-neutral-900 dark:text-white">
              Workspace Applications
            </h2>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              Launch directly into default platforms or your private custom shortcuts
            </p>
          </div>

          <UBadge color="neutral" variant="subtle" size="xs" class="font-mono rounded-xs">
            {{ filteredPlatforms.length }} Apps
          </UBadge>
        </div>

        <!-- Skeleton Grid Loader -->
        <template v-if="isLoading">
          <div :class="viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'">
            <div
              v-for="i in 8"
              :key="`dash-skel-${i}`"
              class="p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-xs space-y-3"
            >
              <div class="flex items-center gap-3">
                <USkeleton class="w-10 h-10 rounded-xs shrink-0" />
                <div class="space-y-1 min-w-0 flex-1">
                  <USkeleton class="w-24 h-4 rounded-xs" />
                  <USkeleton class="w-16 h-3 rounded-xs" />
                </div>
              </div>
              <USkeleton class="w-full h-8 rounded-xs" />
            </div>
          </div>
        </template>

        <!-- Empty Filter State -->
        <template v-else-if="filteredPlatforms.length === 0">
          <div class="py-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xs space-y-3">
            <UIcon name="i-lucide-search-x" class="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 class="text-sm font-bold text-neutral-800 dark:text-neutral-200">
              No platforms found
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
              No applications match your current category filter or search query.
            </p>
            <UButton
              color="neutral"
              variant="outline"
              size="xs"
              class="rounded-xs mt-2"
              @click="selectedCategory = 'all'; searchQuery = ''"
            >
              Reset Filters
            </UButton>
          </div>
        </template>

        <!-- GRID VIEW -->
        <template v-else-if="viewMode === 'grid'">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <UCard
              v-for="platform in filteredPlatforms"
              :key="platform.id"
              class="group bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 rounded-xs shadow-2xs flex flex-col justify-between"
            >
              <div class="space-y-3">
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 rounded-xs bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
                      <UIcon
                        :name="platform.logo || 'i-lucide-globe'"
                        class="w-6 h-6 transition-transform group-hover:scale-110"
                        :style="{ color: platform.color }"
                      />
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <h3 class="font-bold text-sm text-neutral-900 dark:text-white leading-tight">
                          {{ platform.name }}
                        </h3>
                        <UIcon v-if="platform.isCustom" name="i-lucide-lock" class="w-3 h-3 text-amber-500 shrink-0" title="Private Custom App" />
                      </div>
                      <span class="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                        {{ platform.category?.name }}
                      </span>
                    </div>
                  </div>

                  <UBadge
                    v-if="platform.isCustom || platform.badge || platform.status?.name"
                    variant="subtle"
                    size="xs"
                    class="text-[9px] font-mono rounded-xs"
                    :style="{ color: platform.color, borderColor: `${platform.color}30` }"
                  >
                    {{ platform.isCustom ? 'Private' : (platform.badge || platform.status?.name) }}
                  </UBadge>
                </div>

                <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {{ platform.description || 'Custom user platform shortcut' }}
                </p>
              </div>

              <template #footer>
                <div class="flex items-center justify-between pt-1">
                  <div class="flex gap-1 flex-wrap">
                    <span
                      v-for="tag in platform.tags?.slice(0, 2)"
                      :key="tag"
                      class="text-[10px] px-1.5 py-0.5 rounded-xs bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 font-medium"
                    >
                      {{ tag }}
                    </span>
                  </div>

                  <DashboardPlatformAccountMenu
                    :platform-id="platform.id"
                    :workspace-id="activeWorkspace?.id || ''"
                    :accounts="accountsFor(platform.id)"
                    @launch="account => launch(platform, account)"
                    @add="label => launch(platform, addAccount(platform.id, activeWorkspace?.id || '', label))"
                  />
                </div>
              </template>
            </UCard>
          </div>
        </template>

        <!-- LIST VIEW -->
        <template v-else>
          <div class="space-y-2">
            <div
              v-for="platform in filteredPlatforms"
              :key="`list-${platform.id}`"
              class="p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors rounded-xs flex items-center justify-between gap-4"
            >
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <UIcon
                  :name="platform.logo || 'i-lucide-globe'"
                  class="w-6 h-6 shrink-0"
                  :style="{ color: platform.color }"
                />

                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <h3 class="font-bold text-sm text-neutral-900 dark:text-white truncate">
                      {{ platform.name }}
                    </h3>
                    <UIcon v-if="platform.isCustom" name="i-lucide-lock" class="w-3.5 h-3.5 text-amber-500 shrink-0" title="Private Custom App" />
                  </div>
                  <p class="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {{ platform.description || platform.url }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3 shrink-0">
                <span class="text-xs text-neutral-400 font-mono hidden sm:inline">
                  {{ platform.category?.name }}
                </span>
                <DashboardPlatformAccountMenu
                  :platform-id="platform.id"
                  :workspace-id="activeWorkspace?.id || ''"
                  :accounts="accountsFor(platform.id)"
                  @launch="account => launch(platform, account)"
                  @add="label => launch(platform, addAccount(platform.id, activeWorkspace?.id || '', label))"
                />
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </UDashboardPanel>

  <DashboardAddPlatformModal
    v-model:open="isAddModalOpen"
    :categories="categoryOptions"
    @created="loadPlatforms"
  />
</template>