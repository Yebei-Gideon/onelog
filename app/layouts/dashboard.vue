<!-- app/layouts/dashboard.vue -->
<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { user, logout } = useAuth();
const { workspaces, activeWorkspace, selectWorkspace, loadWorkspaces, createWorkspace } = useWorkspaceTabs();
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
    icon: "i-lucide-folder",
    color: "#8B5CF6",
  });
  workspaceName.value = "";
  isWorkspaceModalOpen.value = false;
}

// Multi-page navigation matching pages/dashboard/*
const mainNavigation = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: "Launchpad",
      icon: "i-lucide-layout-dashboard",
      to: "/dashboard",
    },
    {
      label: "Directory",
      icon: "i-lucide-globe",
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
    <UDashboardSidebar resizable collapsible side="left">
      <template #header="{ collapsed }">
        <div class="flex items-center justify-between w-full p-2.5">
          <NuxtLink to="/dashboard" class="flex items-center gap-2.5 min-w-0">
            <CommonAppLogo size="sm" class="shrink-0" />
            <span v-if="!collapsed" class="font-extrabold text-sm tracking-tight text-neutral-900 dark:text-white truncate">
              OneLog
            </span>
          </NuxtLink>
        </div>
      </template>

      <template #default="{ collapsed }">
        <div class="space-y-4 px-2 py-2">
          <div v-if="!collapsed" class="px-1">
            <div class="flex items-center gap-1">
              <USelectMenu
                :model-value="activeWorkspace || undefined"
                :items="workspaces"
                option-attribute="name"
                size="sm"
                class="min-w-0 flex-1 rounded-xs bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                @update:model-value="(val: any) => val && selectWorkspace(val.id)"
              >
                <template #leading>
                  <UIcon
                    v-if="activeWorkspace"
                    :name="activeWorkspace.icon"
                    class="w-4 h-4 shrink-0"
                    :style="{ color: activeWorkspace.color }"
                  />
                </template>
              </USelectMenu>
              <UButton
                icon="i-lucide-plus"
                color="neutral"
                variant="ghost"
                size="xs"
                aria-label="Create workspace"
                @click="isWorkspaceModalOpen = true"
              />
            </div>
          </div>

          <UNavigationMenu
            :collapsed="collapsed"
            :items="mainNavigation"
            orientation="vertical"
            class="w-full"
          />
        </div>
      </template>

      <template #footer="{ collapsed }">
        <div class="flex items-center justify-between gap-2 p-2 border-t border-neutral-200 dark:border-neutral-800 w-full">
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

  <UModal v-model:open="isWorkspaceModalOpen" title="Create workspace" description="Keep platform accounts separated by workspace.">
    <template #body>
      <form class="space-y-4" @submit.prevent="handleCreateWorkspace">
        <UFormField label="Workspace name" required>
          <UInput v-model="workspaceName" placeholder="Marketing, Personal, Client A..." autofocus />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="isWorkspaceModalOpen = false">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="false">Create workspace</UButton>
        </div>
      </form>
    </template>
  </UModal>
</template>