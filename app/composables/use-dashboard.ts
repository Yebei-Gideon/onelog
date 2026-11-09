// app/composables/use-dashboard.ts
import type { SocialPlatform } from "~/types/platform";

export function useDashboard() {
  const { apiFetch } = useApi();
  const { activeWorkspace } = useWorkspaceTabs();

  const platforms = ref<SocialPlatform[]>([]);
  const isLoading = ref(true);
  const searchQuery = ref("");
  const selectedCategory = ref<string>("all");
  const viewMode = ref<"grid" | "list">("grid");
  const isAddModalOpen = ref(false);

  // Fetch all platforms (global + private custom platforms)
  async function loadPlatforms() {
    try {
      isLoading.value = true;
      platforms.value = await apiFetch<SocialPlatform[]>("/platforms");
    }
    catch (err) {
      console.error("[USE_DASHBOARD] Error loading platforms:", err);
    }
    finally {
      isLoading.value = false;
    }
  }

  // Create custom private platform
  async function createCustomPlatform(data: {
    name: string;
    url: string;
    categoryId: string;
    logo?: string;
    color?: string;
    description?: string;
    tags?: string[];
  }) {
    const newPlatform = await apiFetch<SocialPlatform>("/platforms", {
      method: "POST",
      body: data,
    });
    platforms.value.unshift(newPlatform);
    isAddModalOpen.value = false;
    return newPlatform;
  }

  // Delete private platform
  async function deleteCustomPlatform(id: string) {
    await apiFetch(`/platforms/${id}`, { method: "DELETE" });
    platforms.value = platforms.value.filter(p => p.id !== id);
  }

  // Dynamic Category options extracted from current platforms list
  const categoryOptions = computed(() => {
    const map = new Map<string, { label: string; value: string; icon: string }>();
    map.set("all", { label: "All Categories", value: "all", icon: "i-lucide-layers" });

    platforms.value.forEach((p) => {
      if (p.category && !map.has(p.category.slug)) {
        map.set(p.category.slug, {
          label: p.category.name,
          value: p.category.slug,
          icon: p.category.icon || "i-lucide-folder",
        });
      }
    });

    return Array.from(map.values());
  });

  // Filtered platforms by selected category and search string
  const filteredPlatforms = computed(() => {
    return platforms.value.filter((p) => {
      const matchesCategory
        = selectedCategory.value === "all" || p.category?.slug === selectedCategory.value;
      const matchesSearch
        = !searchQuery.value
          || p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
          || p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
          || p.tags?.some(t => t.toLowerCase().includes(searchQuery.value.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  });

  // Summary statistics metrics
  const stats = computed(() => [
    {
      label: "Total Connected",
      value: platforms.value.length,
      icon: "i-lucide-layout-grid",
      color: "text-primary-500",
    },
    {
      label: "Custom Private Apps",
      value: platforms.value.filter(p => p.isCustom).length,
      icon: "i-lucide-lock",
      color: "text-amber-500",
    },
    {
      label: "Active Workspace",
      value: activeWorkspace.value?.name || "Personal",
      icon: activeWorkspace.value?.icon || "i-lucide-user",
      color: "text-emerald-500",
    },
  ]);

  function launchPlatform(url: string) {
    if (import.meta.client) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  return {
    platforms,
    isLoading,
    searchQuery,
    selectedCategory,
    viewMode,
    isAddModalOpen,
    categoryOptions,
    filteredPlatforms,
    stats,
    loadPlatforms,
    createCustomPlatform,
    deleteCustomPlatform,
    launchPlatform,
  };
}