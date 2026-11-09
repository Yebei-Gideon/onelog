// app/composables/use-platform-launcher.ts
import type { ShellEnvironment } from "~/types/workspace";

export type OpenTab = {
  id: string;
  platformId: string;
  slug: string;
  name: string;
  url: string;
  icon?: string;
  workspaceId: string;
  partitionId: string;
};

const creatingWebviews = new Set<string>();
const latestRequestedBounds = new Map<string, { x: number; y: number; width: number; height: number }>();

export function usePlatformLauncher() {
  const environment = ref<ShellEnvironment>("web");
  const openTabs = useState<OpenTab[]>("open-platform-tabs", () => []);
  const activeTabId = useState<string | null>("active-platform-tab-id", () => null);
  const readyTabs = useState<string[]>("ready-platform-tabs", () => []);

  const activeTab = computed(() =>
    openTabs.value.find(t => t.id === activeTabId.value) || null,
  );

  function webviewLabel(slug: string, partitionId: string) {
    let hash = 0;
    for (let i = 0; i < partitionId.length; i++) {
      hash = (hash << 5) - hash + partitionId.charCodeAt(i);
      hash |= 0;
    }
    const hashHex = Math.abs(hash).toString(36);
    return `embed_${slug}_${hashHex}`.toLowerCase().replace(/[^\w-]/g, "_");
  }

  function dataStoreIdentifier(partitionId: string) {
    const bytes = new TextEncoder().encode(partitionId);
    const identifier = new Array<number>(16).fill(0);
    let hash = 2166136261;
    for (const byte of bytes) {
      hash ^= byte;
      hash = Math.imul(hash, 16777619);
    }
    for (let index = 0; index < 4; index++) {
      const value = Math.imul(hash ^ (index * 0x9E3779B9), 2246822519);
      identifier[index * 4] = value & 0xFF;
      identifier[index * 4 + 1] = (value >>> 8) & 0xFF;
      identifier[index * 4 + 2] = (value >>> 16) & 0xFF;
      identifier[index * 4 + 3] = (value >>> 24) & 0xFF;
    }
    return identifier;
  }

  onMounted(() => {
    if (typeof window !== "undefined") {
      if ("__TAURI_INTERNALS__" in window || "__TAURI__" in window) {
        environment.value = "tauri";
      }
      else if ("Capacitor" in window) {
        environment.value = "capacitor";
      }
      else if ("electronAPI" in window) {
        environment.value = "electron";
      }
      else {
        environment.value = "web";
      }
    }
  });

  async function hideAllWebviews() {
    if (environment.value === "tauri" && import.meta.client) {
      try {
        const { Webview } = await import("@tauri-apps/api/webview");
        const all = await Webview.getAll();
        for (const wv of all) {
          if (wv.label.startsWith("embed_")) {
            await wv.hide();
          }
        }
      }
      catch (e) {
        console.warn("[TAURI HIDE ERROR]", e);
      }
    }
  }

  function markTabReady(tabId: string) {
    if (!readyTabs.value.includes(tabId)) {
      readyTabs.value.push(tabId);
    }
  }

  async function syncWebview(
    tabId: string,
    bounds: { x: number; y: number; width: number; height: number },
  ) {
    if (environment.value !== "tauri" || !import.meta.client)
      return;

    const tab = openTabs.value.find(t => t.id === tabId);
    if (!tab)
      return;

    try {
      const { Webview } = await import("@tauri-apps/api/webview");
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      const { LogicalPosition, LogicalSize } = await import("@tauri-apps/api/dpi");

      const label = webviewLabel(tab.slug, tab.partitionId);
      const appWindow = getCurrentWindow();

      // Always update registry with latest DOM measurements
      latestRequestedBounds.set(label, bounds);

      // Hide all non-active platform webviews immediately
      const all = await Webview.getAll();
      for (const wv of all) {
        if (wv.label.startsWith("embed_") && wv.label !== label) {
          await wv.hide();
        }
      }

      let webview = await Webview.getByLabel(label);

      // 1. Existing webview instance: apply latest bounds immediately
      if (webview) {
        const target = latestRequestedBounds.get(label) || bounds;
        const pos = new LogicalPosition(Math.round(target.x), Math.round(target.y));
        const size = new LogicalSize(Math.max(1, Math.round(target.width)), Math.max(1, Math.round(target.height)));

        await webview.setPosition(pos);
        await webview.setSize(size);
        await webview.show();
        await webview.setFocus();
        markTabReady(tabId);
        return;
      }

      // 2. Prevent concurrent duplicate instantiation calls
      if (creatingWebviews.has(label))
        return;
      creatingWebviews.add(label);

      const initBounds = latestRequestedBounds.get(label) || bounds;

      try {
        webview = new Webview(appWindow, label, {
          url: tab.url,
          x: Math.round(initBounds.x),
          y: Math.round(initBounds.y),
          width: Math.max(1, Math.round(initBounds.width)),
          height: Math.max(1, Math.round(initBounds.height)),
          focus: true,
          dragDropEnabled: true,
          dataStoreIdentifier: dataStoreIdentifier(tab.partitionId),
        });

        const applyLatestBounds = async () => {
          creatingWebviews.delete(label);
          try {
            const existing = await Webview.getByLabel(label);
            if (existing) {
              const fresh = latestRequestedBounds.get(label) || bounds;
              const pos = new LogicalPosition(Math.round(fresh.x), Math.round(fresh.y));
              const size = new LogicalSize(Math.max(1, Math.round(fresh.width)), Math.max(1, Math.round(fresh.height)));

              await existing.setPosition(pos);
              await existing.setSize(size);
              await existing.show();
              await existing.setFocus();
              markTabReady(tabId);
            }
          }
          catch (error) {
            console.error("[TAURI EMBED SETUP ERROR]", error);
          }
        };

        webview.once("tauri://created", applyLatestBounds);
        webview.once("tauri://error", applyLatestBounds);
      }
      catch (createErr) {
        creatingWebviews.delete(label);
        const fallback = await Webview.getByLabel(label);
        if (fallback) {
          const fresh = latestRequestedBounds.get(label) || bounds;
          const pos = new LogicalPosition(Math.round(fresh.x), Math.round(fresh.y));
          const size = new LogicalSize(Math.max(1, Math.round(fresh.width)), Math.max(1, Math.round(fresh.height)));

          await fallback.setPosition(pos);
          await fallback.setSize(size);
          await fallback.show();
          await fallback.setFocus();
          markTabReady(tabId);
        }
      }
    }
    catch (e) {
      console.warn("[TAURI SYNC ERROR]", e);
    }
  }

  async function openPlatform(opts: {
    platformId: string;
    platformSlug: string;
    platformName: string;
    targetUrl: string;
    workspaceId: string;
    partitionId?: string;
    icon?: string;
  }) {
    const partition = opts.partitionId || `persist:${opts.workspaceId}_${opts.platformSlug}`;
    const partitionShort = partition.split("_").pop()?.slice(-8) || "main";
    const id = `${opts.platformSlug}-${partitionShort}`.toLowerCase().replace(/[^\w-]/g, "-");

    const existingIndex = openTabs.value.findIndex(t => t.id === id);
    if (existingIndex === -1) {
      openTabs.value.push({
        id,
        platformId: opts.platformId,
        slug: opts.platformSlug,
        name: opts.platformName,
        url: opts.targetUrl,
        icon: opts.icon,
        workspaceId: opts.workspaceId,
        partitionId: partition,
      });
    }

    activeTabId.value = id;
    await navigateTo(`/dashboard/app/${id}`);
  }

  async function closeTab(id: string) {
    const index = openTabs.value.findIndex(t => t.id === id);
    if (index !== -1) {
      const closedTab = openTabs.value[index];
      openTabs.value.splice(index, 1);
      readyTabs.value = readyTabs.value.filter(tabId => tabId !== id);

      if (environment.value === "tauri" && import.meta.client) {
        try {
          const { Webview } = await import("@tauri-apps/api/webview");
          const label = webviewLabel(closedTab.slug, closedTab.partitionId);
          latestRequestedBounds.delete(label);
          const wv = await Webview.getByLabel(label);
          if (wv) {
            await wv.close();
          }
        }
        catch (e) {
          console.warn("[TAURI CLOSE ERROR]", e);
        }
      }

      if (activeTabId.value === id) {
        const remainingWorkspaceTabs = openTabs.value.filter(
          t => t.workspaceId === closedTab.workspaceId,
        );
        if (remainingWorkspaceTabs.length > 0) {
          const nextTab = remainingWorkspaceTabs[remainingWorkspaceTabs.length - 1];
          activeTabId.value = nextTab.id;
          await navigateTo(`/dashboard/app/${nextTab.id}`);
        }
        else {
          activeTabId.value = null;
          await navigateTo("/dashboard");
        }
      }
    }
  }

  return {
    environment,
    openTabs,
    readyTabs,
    activeTabId,
    activeTab,
    openPlatform,
    syncWebview,
    hideAllWebviews,
    closeTab,
  };
}
