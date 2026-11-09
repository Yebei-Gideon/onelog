import type { ViewMode } from "~/types/platform";

export function useViewMode() {
  const viewMode = useState<ViewMode>("platform-view-mode", () => "grid");

  function setViewMode(mode: ViewMode) {
    viewMode.value = mode;
  }

  return { viewMode, setViewMode };
}
