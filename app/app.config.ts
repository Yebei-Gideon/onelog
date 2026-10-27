export default defineAppConfig({
  ui: {
    colors: {
      primary: "brand-lime",
      neutral: "slate",
      secondary: "yellow",
      success: "green",
      info: "blue",
      warning: "yellow",
      error: "red",
    },
    icons: {
      arrowDown: "i-tabler-arrow-down",
      arrowLeft: "i-tabler-arrow-left",
      arrowRight: "i-tabler-arrow-right",
      arrowUp: "i-tabler-arrow-up",
      caution: "i-tabler-alert-square-rounded",
      check: "i-tabler-check",
      chevronDoubleLeft: "i-tabler-chevrons-left",
      chevronDoubleRight: "i-tabler-chevrons-right",
      chevronDown: "i-tabler-chevron-down",
      chevronLeft: "i-tabler-chevron-left",
      chevronRight: "i-tabler-chevron-right",
      chevronUp: "i-tabler-chevron-up",
      close: "i-tabler-x",
      copy: "i-tabler-copy",
      copyCheck: "i-tabler-copy-check",
      dark: "i-tabler-moon",
      drag: "i-tabler-grip-vertical",
      ellipsis: "i-tabler-dots",
      error: "i-tabler-square-rounded-x",
      external: "i-tabler-external-link",
      eye: "i-tabler-eye",
      eyeOff: "i-tabler-eye-off",
      file: "i-tabler-file",
      folder: "i-tabler-folder",
      folderOpen: "i-tabler-folder-open",
      hash: "i-tabler-hash",
      info: "i-tabler-info-square-rounded",
      light: "i-tabler-sun",
      loading: "i-tabler-loader-2",
      menu: "i-tabler-menu",
      minus: "i-tabler-minus",
      panelClose: "i-tabler-layout-sidebar-left-collapse",
      panelOpen: "i-tabler-layout-sidebar-left-expand",
      plus: "i-tabler-plus",
      reload: "i-tabler-reload",
      search: "i-tabler-search",
      stop: "i-tabler-player-stop",
      star: "i-tabler-star",
      success: "i-tabler-square-rounded-check",
      system: "i-tabler-device-desktop",
      tip: "i-tabler-bulb",
      upload: "i-tabler-upload",
      warning: "i-tabler-alert-triangle",
    },
    button: {
      defaultVariants: {
        size: "md",
      },
      slots: {
        base: "rounded-sm font-bold uppercase transition-all duration-200 focus-visible:outline-2 focus-visible:outline-lime-500",
      },
      compoundVariants: [
        {
          color: "primary",
          variant: "solid",
          class: "text-neutral-950 bg-lime-500 hover:bg-lime-400 dark:bg-lime-400 dark:text-neutral-950 dark:hover:bg-lime-300 shadow-xs",
        },
        {
          color: "neutral",
          variant: "outline",
          class: "border-neutral-300 text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800",
        },
      ],
    },
    card: {
      slots: {
        header: "px-4 py-2 border-b border-neutral-200/90 dark:border-neutral-800",
        body: "px-4 py-2",
        footer: "px-4 py-2 border-t border-neutral-200/90 dark:border-neutral-800",
        root: "rounded-md border border-neutral-200/90 bg-white text-neutral-900 shadow-xs transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
      },
      defaultVariants: {
        variant: "subtle",
      },
    },
    input: {
      slots: {
        root: "relative",
        base: "rounded-sm border-neutral-300 bg-white text-neutral-900 focus:border-lime-500 focus:ring-lime-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white",
      },
    },
    alert: {
      defaultVariants: {
        variant: "subtle",
      },
    },
    select: {
      slots: {
        base: "rounded-sm border-neutral-300 bg-white text-neutral-900 focus:border-lime-500 focus:ring-lime-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white",
      },
    },
    badge: {
      slots: {
        base: "rounded-sm font-black uppercase tracking-wider",
      },
    },
  },
  uiV2: {
    button: {
      slots: {
        root: "relative",
        base: "rounded-sm border-neutral-300 bg-white text-neutral-900 focus:border-lime-500 focus:ring-lime-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white",
      },
    },
    badge: {
      slots: {
        root: "rounded-sm font-black uppercase tracking-wider",
      },
    },
  },
});
