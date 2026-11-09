// app/composables/use-platform-launcher.ts
import type { ShellEnvironment } from "~/types/workspace";

export type ActivePlatformView = {
  slug: string;
  name: string;
  url: string;
  icon?: string;
  workspaceId: string;
  partitionId: string;
};

export function usePlatformLauncher() {
  const environment = ref<ShellEnvironment>("web");
  const activeView = useState<ActivePlatformView | null>("active-platform-view", () => null);
  const isViewerOpen = computed(() => activeView.value !== null);

  function webviewLabel(slug: string, partitionId: string) {
    return `embed_${slug}_${partitionId}`.replace(/[^\w-]/g, "_");
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
      const value = Math.imul(hash ^ (index * 0x9e3779b9), 2246822519);
      identifier[index * 4] = value & 0xff;
      identifier[index * 4 + 1] = (value >>> 8) & 0xff;
      identifier[index * 4 + 2] = (value >>> 16) & 0xff;
      identifier[index * 4 + 3] = (value >>> 24) & 0xff;
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

  async function updateWebviewBounds(bounds: { x: number; y: number; width: number; height: number }) {
    if (environment.value !== "tauri" || !import.meta.client || !activeView.value)
      return;

    try {
      const { Webview } = await import("@tauri-apps/api/webview");
      const { LogicalPosition, LogicalSize } = await import("@tauri-apps/api/dpi");

      const label = webviewLabel(activeView.value.slug, activeView.value.partitionId);

      const webview = await Webview.getByLabel(label);
      if (webview) {
        await webview.setPosition(new LogicalPosition(Math.round(bounds.x), Math.round(bounds.y)));
        await webview.setSize(new LogicalSize(Math.round(bounds.width), Math.round(bounds.height)));
      }
    }
    catch (e) {
      console.warn("[TAURI BOUNDS UPDATE ERROR]", e);
    }
  }

  async function launchPlatform(opts: {
    platformSlug: string;
    platformName: string;
    targetUrl: string;
    workspaceId: string;
    partitionId?: string;
    icon?: string;
    bounds?: { x: number; y: number; width: number; height: number };
  }) {
    const partition = opts.partitionId || `persist:${opts.workspaceId}_${opts.platformSlug}`;

    activeView.value = {
      slug: opts.platformSlug,
      name: opts.platformName,
      url: opts.targetUrl,
      icon: opts.icon,
      workspaceId: opts.workspaceId,
      partitionId: partition,
    };

    if (environment.value === "tauri" && import.meta.client) {
      try {
        const { Webview } = await import("@tauri-apps/api/webview");
        const { getCurrentWindow } = await import("@tauri-apps/api/window");
        const { LogicalPosition, LogicalSize } = await import("@tauri-apps/api/dpi");

        const label = webviewLabel(opts.platformSlug, partition);
        const appWindow = getCurrentWindow();

        await hideAllWebviews();

        const existing = await Webview.getByLabel(label);
        const nativeSize = await appWindow.innerSize();
        const scaleFactor = await appWindow.scaleFactor();
        const logicalSize = nativeSize.toLogical(scaleFactor);
        const b = opts.bounds || {
          x: 0,
          y: 48,
          width: logicalSize.width,
          height: Math.max(1, logicalSize.height - 48),
        };

        const pos = new LogicalPosition(Math.round(b.x), Math.round(b.y));
        const size = new LogicalSize(Math.round(b.width), Math.round(b.height));

        if (existing) {
          await existing.setPosition(pos);
          await existing.setSize(size);
          await existing.show();
          await existing.setFocus();
        }
        else {
          const webview = new Webview(appWindow, label, {
            url: opts.targetUrl,
            x: Math.round(b.x),
            y: Math.round(b.y),
            width: Math.round(b.width),
            height: Math.round(b.height),
            focus: true,
            dragDropEnabled: true,
            dataStoreIdentifier: dataStoreIdentifier(partition),
          });

          webview.once("tauri://created", async () => {
            try {
              await webview.setPosition(pos);
              await webview.setSize(size);
              await webview.show();
              await webview.setFocus();
              console.info(`[TAURI EMBED SUCCESS] Child webview aligned to full screen: ${label}`);
            }
            catch (error) {
              console.error("[TAURI EMBED SETUP ERROR]", error);
            }
          });
          webview.once("tauri://error", (event) => {
            console.error("[TAURI EMBED CREATE ERROR]", event);
          });
        }
      }
      catch (e) {
        console.warn("[TAURI EMBED ERROR]", e);
        window.open(opts.targetUrl, "_blank", "noopener,noreferrer");
      }
    }
    else if (import.meta.client && environment.value !== "web") {
      window.open(opts.targetUrl, "_blank", "noopener,noreferrer");
    }
  }

  async function closeActiveViewer() {
    await hideAllWebviews();
    activeView.value = null;
  }

  return {
    environment,
    activeView,
    isViewerOpen,
    launchPlatform,
    updateWebviewBounds,
    hideAllWebviews,
    closeActiveViewer,
  };
}
