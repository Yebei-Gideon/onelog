<!-- app/layouts/dashboard.vue -->
<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { user, logout } = useAuth();
const { workspaces, activeWorkspace, selectWorkspace, loadWorkspaces, createWorkspace } = useWorkspaceTabs();
const { openTabs, closeTab } = usePlatformLauncher();
const route = useRoute();

const isWorkspaceModalOpen = ref(false);
const workspaceName = ref("");

onMounted(() => {
  loadWorkspaces().catch((error) => {
    console.error("[DASHBOARD] Failed to load workspaces:", error);
  });
});

async function handleCreateWorkspace() {
  if (!workspaceName.value.trim())
    return;
  await createWorkspace({
    name: workspaceName.value,
    icon: "i-lucide-folder-git-2",
    color: "#6366F1",
  });
  workspaceName.value = "";
  isWorkspaceModalOpen.value = false;
}

const mainNavigation = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: "Launchpad",
      icon: "i-lucide-layout-grid",
      to: "/dashboard",
      exact: true,
    },
    {
      label: "Directory",
      icon: "i-lucide-compass",
      to: "/dashboard/directory",
    },
    {
      label: "Analytics",
      icon: "i-lucide-line-chart",
      to: "/dashboard/analytics",
    },
  ],
  [
    {
      label: "Settings",
      icon: "i-lucide-settings",
      to: "/dashboard/settings",
    },
  ],
]);

const activeWorkspaceTabs = computed(() => {
  if (!activeWorkspace.value)
    return openTabs.value;
  return openTabs.value.filter(t => t.workspaceId === activeWorkspace.value.id);
});

function handleTabClick(tabId: string) {
  navigateTo(`/dashboard/app/${tabId}`);
}

function handleCloseTab(event: MouseEvent, tabId: string) {
  event.stopPropagation();
  closeTab(tabId);
}

const userMenuItems = computed(() => [
  [
    {
      label: user.value?.email || "User Account",
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Profile & Security",
      icon: "i-lucide-user-cog",
      to: "/dashboard/settings",
    },
    {
      label: "Sign Out",
      icon: "i-lucide-log-out",
      color: "error" as const,
      onSelect: () => logout(),
    },
  ],
]);
</script>

<template>
  <UDashboardGroup storage-key="onelog-sidebar">
    <UDashboardSidebar
      resizable
      collapsible
      side="left"
      class="bg-neutral-50/50 dark:bg-neutral-950/60 border-r border-neutral-200/80 dark:border-neutral-800/80"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center justify-between w-full p-2.5">
          <NuxtLink to="/dashboard" class="flex items-center gap-2.5 min-w-0 group">
            <CommonAppLogo size="sm" class="shrink-0 transition-transform group-hover:scale-105" />
            <span v-if="!collapsed" class="font-black text-base tracking-tight text-neutral-900 dark:text-white truncate">
              One<span class="text-primary-500">Log</span>
            </span>
          </NuxtLink>
        </div>
      </template>

      <template #default="{ collapsed }">
        <div class="space-y-4 px-2 py-2">
          <!-- Workspace Switcher -->
          <div v-if="!collapsed" class="px-1">
            <div class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 px-1">
              Workspace
            </div>
            <div class="flex items-center gap-1.5 bg-neutral-100/80 dark:bg-neutral-900/80 p-1 rounded-md border border-neutral-200/60 dark:border-neutral-800/60">
              <USelectMenu
                :model-value="activeWorkspace || undefined"
                :items="workspaces"
                option-attribute="name"
                size="sm"
                class="min-w-0 flex-1 border-0 shadow-none bg-transparent"
                @update:model-value="(val: any) => val && selectWorkspace(val.id)"
              >
                <template #leading>
                  <UIcon
                    v-if="activeWorkspace"
                    :name="activeWorkspace.icon || 'i-lucide-briefcase'"
                    class="w-4 h-4 shrink-0"
                    :style="{ color: activeWorkspace.color || '#6366F1' }"
                  />
                </template>
              </USelectMenu>
              <UButton
                icon="i-lucide-plus"
                color="neutral"
                variant="ghost"
                size="xs"
                class="rounded-xs shrink-0"
                aria-label="Create workspace"
                @click="isWorkspaceModalOpen = true"
              />
            </div>
          </div>

          <!-- Navigation Links -->
          <UNavigationMenu
            :collapsed="collapsed"
            :items="mainNavigation"
            orientation="vertical"
            class="w-full"
          />

          <!-- Active Workspace App Tabs -->
          <div v-if="!collapsed && activeWorkspaceTabs.length > 0" class="pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 space-y-1">
            <div class="px-2 py-1 flex items-center justify-between text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
              <span>Active Apps</span>
              <UBadge
                color="primary"
                variant="subtle"
                size="xs"
                class="font-mono text-[9px] px-1.5 py-0.5 rounded-full"
              >
                {{ activeWorkspaceTabs.length }}
              </UBadge>
            </div>

            <div class="space-y-0.5 max-h-48 overflow-y-auto no-scrollbar pr-0.5">
              <div
                v-for="tab in activeWorkspaceTabs"
                :key="tab.id"
                class="group flex items-center justify-between px-2.5 py-1.5 rounded-xs cursor-pointer text-xs transition-all duration-150"
                :class="[
                  route.params.id === tab.id
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold border-l-2 border-primary-500 pl-2'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900/60',
                ]"
                @click="handleTabClick(tab.id)"
              >
                <div class="flex items-center gap-2 min-w-0 flex-1">
                  <UIcon :name="tab.icon || 'i-lucide-globe'" class="w-4 h-4 shrink-0" />
                  <span class="truncate text-xs">{{ tab.name }}</span>
                </div>

                <UButton
                  color="neutral"
                  variant="ghost"
                  size="2xs"
                  icon="i-lucide-x"
                  class="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 p-0.5 rounded-xs"
                  @click="(e) => handleCloseTab(e, tab.id)"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer="{ collapsed }">
        <div class="flex items-center justify-between gap-2 p-2 border-t border-neutral-200/80 dark:border-neutral-800/80 w-full">
          <UDropdownMenu :items="userMenuItems" :popper="{ placement: 'top-start' }">
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              class="w-full flex items-center gap-2.5 rounded-xs justify-start px-2 py-1.5"
            >
              <UAvatar
                :src="user?.avatarUrl || undefined"
                :alt="user?.name || user?.email || 'User'"
                size="sm"
                class="shrink-0 bg-primary-500/20 text-primary-500 font-bold"
              />
              <div v-if="!collapsed" class="flex flex-col text-left min-w-0 leading-tight">
                <span class="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                  {{ user?.name || 'OneLog User' }}
                </span>
                <span class="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                  {{ user?.email }}
                </span>
              </div>
            </UButton>
          </UDropdownMenu>

          <CommonThemeToggle v-if="!collapsed" size="xs" />
        </div>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>

  <!-- Create Workspace Modal -->
  <UModal
    v-model:open="isWorkspaceModalOpen"
    title="Create New Workspace"
    description="Organize apps and separate session accounts per environment."
  >
    <template #body>
      <form class="space-y-4" @submit.prevent="handleCreateWorkspace">
        <UFormField label="Workspace Name" required>
          <UInput
            v-model="workspaceName"
            placeholder="e.g. Marketing, Personal, Client Projects..."
            icon="i-lucide-folder-plus"
            autofocus
            class="rounded-xs"
          />
        </UFormField>
        <div class="flex justify-end gap-2 pt-2">
          <UButton
            color="neutral"
            variant="ghost"
            class="rounded-xs"
            @click="isWorkspaceModalOpen = false"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            color="primary"
            class="font-bold rounded-xs shadow-xs"
            icon="i-lucide-check"
          >
            Create Workspace
          </UButton>
        </div>
      </form>
    </template>
  </UModal>
</template>
