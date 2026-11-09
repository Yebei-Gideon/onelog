// app/composables/use-workspace-tabs.ts
import type { Workspace } from "~/types/workspace";

export function useWorkspaceTabs() {
  const { apiFetch } = useApi();
  const workspaces = useState<Workspace[]>("workspaces", () => []);
  const activeWorkspaceId = useCookie<string | null>("active_workspace_id", { default: () => null });
  const isLoading = ref(false);

  const activeWorkspace = computed(() =>
    workspaces.value.find(w => w.id === activeWorkspaceId.value) || workspaces.value[0] || null,
  );

  function selectWorkspace(id: string) {
    activeWorkspaceId.value = id;
  }

  async function loadWorkspaces() {
    isLoading.value = true;
    try {
      workspaces.value = await apiFetch<Workspace[]>("/workspaces");
      if (!activeWorkspaceId.value || !workspaces.value.some(w => w.id === activeWorkspaceId.value))
        activeWorkspaceId.value = workspaces.value[0]?.id || null;
    }
    finally {
      isLoading.value = false;
    }
  }

  async function createWorkspace(data: Pick<Workspace, "name" | "icon" | "color">) {
    const workspace = await apiFetch<Workspace>("/workspaces", { method: "POST", body: data });
    workspaces.value.push({ ...workspace, platforms: [] });
    selectWorkspace(workspace.id);
    return workspace;
  }

  async function deleteWorkspace(id: string) {
    if (workspaces.value.length <= 1)
      throw new Error("At least one workspace is required");
    await apiFetch(`/workspaces/${id}`, { method: "DELETE" });
    workspaces.value = workspaces.value.filter(workspace => workspace.id !== id);
    if (activeWorkspaceId.value === id)
      activeWorkspaceId.value = workspaces.value[0]?.id || null;
  }

  async function addPlatformToWorkspace(workspaceId: string, platformId: string, customUrl?: string) {
    await apiFetch(`/workspaces/${workspaceId}/platforms`, {
      method: "POST",
      body: { platformId, customUrl },
    });
    const workspace = workspaces.value.find(item => item.id === workspaceId);
    if (workspace && !workspace.platforms.some(item => item.platformId === platformId)) {
      workspace.platforms.push({
        id: crypto.randomUUID(),
        workspaceId,
        platformId,
        platformSlug: "",
        customUrl,
        partitionId: "",
        displayOrder: workspace.platforms.length,
      });
    }
  }

  return {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    selectWorkspace,
    loadWorkspaces,
    createWorkspace,
    deleteWorkspace,
    isLoading,
    addPlatformToWorkspace,
  }
}