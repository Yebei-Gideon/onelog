<!-- app/pages/dashboard/app/[...id].vue -->
<script setup lang="ts">
definePageMeta({
  layout: false, // Disables standard dashboard sidebar layout
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();
const {
  openTabs,
  readyTabs,
  activeTabId,
  syncWebview,
  hideAllWebviews,
  closeTab,
  openPlatform,
  environment,
} = usePlatformLauncher();
const { activeWorkspace } = useWorkspaceTabs();
const { platforms, loadPlatforms } = useDashboard();

const rawParam = route.params.id;
const tabId = computed(() => (Array.isArray(rawParam)
  ? rawParam.join("/")
  : rawParam || ""));
const currentTab = computed(() => openTabs.value.find(t => t.id === tabId.value));

const containerRef = ref<HTMLElement | null>(null);
const isQuickLaunchOpen = ref(false);
const searchQuery = ref("");
let animationFrameId: number | null = null;
let lastBounds = { x: -1, y: -1, w: -1, h: -1 };

watch(
  tabId,
  (newId) => {
    if (newId)
      activeTabId.value = newId;
  },
  { immediate: true },
);

const availablePlatforms = computed(() => {
  if (!searchQuery.value)
    return platforms.value;
  const q = searchQuery.value.toLowerCase();
  return platforms.value.filter(
    p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q),
  );
});

function trackBounds() {
  if (!containerRef.value || !currentTab.value)
    return;

  const rect = containerRef.value.getBoundingClientRect();

  if (
    Math.abs(rect.left - lastBounds.x) > 0.5
    || Math.abs(rect.top - lastBounds.y) > 0.5
    || Math.abs(rect.width - lastBounds.w) > 0.5
    || Math.abs(rect.height - lastBounds.h) > 0.5
  ) {
    lastBounds = {
      x: rect.left,
      y: rect.top,
      w: rect.width,
      h: rect.height,
    };

    if (rect.width > 0 && rect.height > 0) {
      syncWebview(currentTab.value.id, {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
    }
  }

  animationFrameId = requestAnimationFrame(trackBounds);
}

function handleRefresh() {
  if (!currentTab.value)
    return;

  if (environment.value !== "tauri") {
    const iframe = containerRef.value?.querySelector("iframe");
    if (iframe)
      iframe.src = currentTab.value.url;
  }
  else {
    readyTabs.value = readyTabs.value.filter(id => id !== currentTab.value!.id);
    lastBounds = { x: -1, y: -1, w: -1, h: -1 };
  }
}

function handleOpenExternal() {
  if (currentTab.value?.url) {
    window.open(currentTab.value.url, "_blank", "noopener,noreferrer");
  }
}

function handleCloseTab(id: string) {
  closeTab(id);
}

async function handleQuickLaunch(platform: { id: string; slug: string; name: string; url: string; logo?: string }) {
  if (!activeWorkspace.value)
    return;
  isQuickLaunchOpen.value = false;
  await openPlatform({
    platformId: platform.id,
    platformSlug: platform.slug,
    platformName: platform.name,
    targetUrl: platform.url,
    workspaceId: activeWorkspace.value.id,
    icon: platform.logo,
  });
}

onMounted(() => {
  loadPlatforms();
  if (!currentTab.value) {
    router.push("/dashboard");
    return;
  }

  animationFrameId = requestAnimationFrame(trackBounds);
  window.addEventListener("scroll", trackBounds, true);
});

onUnmounted(() => {
  if (animationFrameId !== null)
    cancelAnimationFrame(animationFrameId);
  window.removeEventListener("scroll", trackBounds, true);
  hideAllWebviews();
});

onBeforeRouteLeave(() => {
  hideAllWebviews();
});
</script>

<template>
  <div class="w-screen h-screen flex flex-col overflow-hidden bg-neutral-950 text-white select-none">
    <!-- Top Dock Navigation Bar (Explicit 48px height) -->
    <header class="h-12 shrink-0 bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-800 px-3 flex items-center justify-between gap-3 z-50">
      <!-- Left: Back to Workspace Launchpad -->
      <div class="flex items-center gap-2 shrink-0">
        <UButton
          color="neutral"
          variant="subtle"
          size="sm"
          icon="i-lucide-arrow-left"
          class="font-semibold rounded-md hover:bg-neutral-800"
          @click="router.push('/dashboard')"
        >
          <span class="hidden sm:inline">Launchpad</span>
        </UButton>
      </div>

      <!-- Center: Opened Apps Tabs Switcher Bar -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-xl py-1 px-1">
        <div
          v-for="tab in openTabs"
          :key="`nav-tab-${tab.id}`"
          class="group flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-all duration-150 shrink-0 border"
          :class="[
            tab.id === currentTab?.id
              ? 'bg-neutral-800 text-white border-neutral-700 shadow-sm'
              : 'bg-neutral-900/50 text-neutral-400 border-transparent hover:bg-neutral-800/50 hover:text-neutral-200',
          ]"
          @click="router.push(`/dashboard/app/${tab.id}`)"
        >
          <UIcon :name="tab.icon || 'i-lucide-globe'" class="w-3.5 h-3.5 shrink-0" />
          <span class="truncate max-w-[110px]">{{ tab.name }}</span>

          <button
            type="button"
            class="opacity-60 group-hover:opacity-100 hover:text-red-400 p-0.5 rounded transition-opacity"
            @click.stop="handleCloseTab(tab.id)"
          >
            <UIcon name="i-lucide-x" class="w-3 h-3" />
          </button>
        </div>

        <!-- Add Platform Button -->
        <UButton
          color="neutral"
          variant="ghost"
          size="xs"
          icon="i-lucide-plus"
          class="rounded-md shrink-0 text-neutral-400 hover:text-white"
          title="Open Another Platform"
          @click="isQuickLaunchOpen = true"
        />
      </div>

      <!-- Right: Action Controls -->
      <div class="flex items-center gap-1 shrink-0">
        <UButton
          color="neutral"
          variant="ghost"
          size="xs"
          icon="i-lucide-rotate-cw"
          title="Refresh View & Bounds"
          @click="handleRefresh"
        />
        <UButton
          color="neutral"
          variant="ghost"
          size="xs"
          icon="i-lucide-external-link"
          title="Open in Browser"
          @click="handleOpenExternal"
        />
        <UButton
          v-if="currentTab"
          color="error"
          variant="subtle"
          size="xs"
          icon="i-lucide-x"
          class="font-semibold rounded-md"
          @click="handleCloseTab(currentTab.id)"
        >
          <span class="hidden sm:inline">Close</span>
        </UButton>
      </div>
    </header>

    <!-- Native Child Webview Target Area (Spans from y=48px to bottom of window) -->
    <main class="flex-1 w-full relative min-h-0 min-w-0 bg-neutral-950 overflow-hidden">
      <div ref="containerRef" class="absolute inset-0 w-full h-full">
        <!-- Web Browser Fallback (iFrame) -->
        <iframe
          v-if="environment !== 'tauri' && currentTab"
          :src="currentTab.url"
          class="w-full h-full border-0 bg-white"
          allow="fullscreen; clipboard-read; clipboard-write; autoplay; camera; microphone"
        />

        <!-- Native Tauri Placeholder Loader -->
        <div
          v-else-if="environment === 'tauri' && (!currentTab || !readyTabs.includes(currentTab.id))"
          class="absolute inset-0 z-10 w-full h-full flex flex-col items-center justify-center bg-neutral-950 text-neutral-400 p-6 space-y-3"
        >
          <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary-500" />
          <p class="text-xs font-mono">
            Launching embedded view for {{ currentTab?.name }}...
          </p>
        </div>
      </div>
    </main>

    <!-- Quick Switcher Modal -->
    <UModal
      v-model:open="isQuickLaunchOpen"
      title="Switch or Open Platform"
      description="Launch an application directly inside your workspace active tabs."
    >
      <template #body>
        <div class="space-y-4">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search platform to launch..."
            autofocus
            class="w-full rounded-md"
          />

          <div class="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
            <div
              v-for="platform in availablePlatforms"
              :key="`quick-${platform.id}`"
              class="p-2.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-md cursor-pointer flex items-center gap-3 transition-colors"
              @click="handleQuickLaunch(platform)"
            >
              <UIcon
                :name="platform.logo || 'i-lucide-globe'"
                class="w-5 h-5 shrink-0"
                :style="{ color: platform.color }"
              />
              <div class="min-w-0 flex-1">
                <h4 class="font-bold text-xs text-white truncate">
                  {{ platform.name }}
                </h4>
                <p class="text-[10px] text-neutral-400 truncate">
                  {{ platform.category?.name || 'App' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
