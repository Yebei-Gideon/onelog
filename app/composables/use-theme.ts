import { useColorMode } from "#imports";
// app/composables/use-theme.ts
import { computed, nextTick } from "vue";

export type ThemePreference = "light" | "dark" | "system";

export function useTheme() {
  const colorMode = useColorMode();

  // Manage colorMode.preference ('light' | 'dark' | 'system')
  const preference = computed<ThemePreference>({
    get: () => (colorMode.preference as ThemePreference) || "system",
    set: (val: ThemePreference) => {
      colorMode.preference = val;
    },
  });

  const isDark = computed(() => colorMode.value === "dark");

  // Dynamic icon based on active preference
  const icon = computed(() => {
    switch (preference.value) {
      case "light":
        return "i-tabler-sun";
      case "dark":
        return "i-tabler-moon";
      case "system":
      default:
        return "i-tabler-device-desktop";
    }
  });

  // Dynamic ARIA label based on active preference
  const ariaLabel = computed(() => {
    switch (preference.value) {
      case "light":
        return "Theme: Light. Switch to dark mode";
      case "dark":
        return "Theme: Dark. Switch to system mode";
      case "system":
      default:
        return "Theme: System. Switch to light mode";
    }
  });

  const toggleTheme = async (event?: MouseEvent) => {
    // Cycle: light -> dark -> system -> light
    const nextPreference: ThemePreference
      = preference.value === "light"
        ? "dark"
        : preference.value === "dark"
          ? "system"
          : "light";

    const isAppearanceTransition
      = typeof document !== "undefined"
        && "startViewTransition" in document
        && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isAppearanceTransition || !event) {
      preference.value = nextPreference;
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(async () => {
      preference.value = nextPreference;
      await nextTick();
    });

    await transition.ready;

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 400,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  };

  return {
    colorMode,
    preference,
    isDark,
    icon,
    ariaLabel,
    toggleTheme,
  };
}
