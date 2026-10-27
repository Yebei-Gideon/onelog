<!-- app/pages/index.vue -->
<script setup lang="ts">
import { FEATURED_PLATFORMS, LANDING_FEATURES } from "~/utils/constants";

definePageMeta({
  layout: "default",
});

const { user } = useAuth();
const hoveredPlatformId = ref<string | null>(null);

// Featured platforms for hero bento grid showcase (12 platforms)
const heroGridPlatforms = computed(() => FEATURED_PLATFORMS.slice(0, 12));

// Distribute platforms evenly across 3 marquee rows
const row1Platforms = computed(() =>
  FEATURED_PLATFORMS.filter((_, i) => i % 3 === 0),
);
const row2Platforms = computed(() =>
  FEATURED_PLATFORMS.filter((_, i) => i % 3 === 1),
);
const row3Platforms = computed(() =>
  FEATURED_PLATFORMS.filter((_, i) => i % 3 === 2),
);
</script>

<template>
  <div class="space-y-16 sm:space-y-24 py-6 sm:py-12 transition-colors duration-200">
    <!-- HERO SECTION (2-COLUMN GRID ON DESKTOP) -->
    <section class="relative space-y-8 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center text-left">
      <!-- Ambient Backlight Glow -->
      <div
        class="absolute -top-16 left-1/2 -translate-x-1/2 -z-10 w-72 sm:w-150 h-72 sm:h-96 bg-primary-500/15 dark:bg-primary-500/20 blur-[130px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <!-- Left Column: Copy & Actions -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Hero Badge -->
        <div class="flex justify-start">
          <UBadge
            color="neutral"
            variant="subtle"
            size="md"
            class="inline-flex items-center gap-2 px-3 py-1 rounded-xs text-xs font-semibold border border-neutral-200/80 dark:border-neutral-800/80 backdrop-blur-md shadow-2xs"
          >
            <UIcon name="i-lucide-sparkles" class="w-4 h-4 text-primary-500 animate-pulse" />
            <span>OneLog — Social Launchpad</span>
          </UBadge>
        </div>

        <!-- Main Headline -->
        <h1 class="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-white leading-[1.12]">
          Your Central Launchpad for <br class="hidden sm:inline">
          <span class="bg-linear-to-r from-primary-500 via-emerald-400 to-primary-600 bg-clip-text text-transparent">
            Every Social Platform
          </span>
        </h1>

        <!-- Subtitle -->
        <p class="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal max-w-xl">
          Stop juggling tabs and bookmarks. Connect and launch all your social, developer, and professional networks from a single, high-performance workspace.
        </p>

        <!-- CTA ACTION BUTTONS -->
        <div class="pt-2 flex flex-row items-center justify-start gap-3">
          <template v-if="user">
            <UButton
              to="/dashboard"
              size="lg"
              color="primary"
              variant="solid"
              icon="i-lucide-layout-dashboard"
              trailing
              class="font-bold rounded-sm shadow-md shadow-primary-500/20 hover:shadow-primary-500/35 transition-all duration-200"
            >
              Go to Dashboard
            </UButton>
          </template>
          <template v-else>
            <UButton
              to="/signup"
              size="lg"
              color="primary"
              variant="solid"
              icon="i-lucide-rocket"
              trailing
              class="font-bold rounded-sm shadow-md shadow-primary-500/20 hover:shadow-primary-500/35 transition-all duration-200"
            >
              Get Started
            </UButton>
            <UButton
              to="/login"
              size="lg"
              color="neutral"
              variant="outline"
              icon="i-lucide-log-in"
              trailing
              class="font-semibold rounded-sm border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-200"
            >
              Sign In
            </UButton>
          </template>
        </div>

        <!-- KEY BENEFITS FLAT GRID BAR WITH Minimal Radius -->
        <div class="pt-4">
          <div class="rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-200 dark:bg-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-px text-xs font-medium">
            <div class="px-3.5 py-2.5 bg-white dark:bg-neutral-950 flex items-center justify-start gap-2 text-neutral-700 dark:text-neutral-300">
              <UIcon name="i-lucide-check-circle-2" class="text-primary-500 w-4 h-4 shrink-0" />
              <span>Stateless Workspace</span>
            </div>
            <div class="px-3.5 py-2.5 bg-white dark:bg-neutral-950 flex items-center justify-start gap-2 text-neutral-700 dark:text-neutral-300">
              <UIcon name="i-lucide-check-circle-2" class="text-primary-500 w-4 h-4 shrink-0" />
              <span>Grid & List Views</span>
            </div>
            <div class="px-3.5 py-2.5 bg-white dark:bg-neutral-950 flex items-center justify-start gap-2 text-neutral-700 dark:text-neutral-300">
              <UIcon name="i-lucide-check-circle-2" class="text-primary-500 w-4 h-4 shrink-0" />
              <span>Extension Unmasking Bridge</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Bento Grid Platform Showcase -->
      <div class="lg:col-span-5">
        <div class="rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-200 dark:bg-neutral-800 grid grid-cols-3 sm:grid-cols-4 gap-px shadow-xs">
          <NuxtLink
            v-for="platform in heroGridPlatforms"
            :key="`hero-bento-${platform.id}`"
            :to="user ? '/dashboard' : '/login'"
            class="group p-4 bg-white dark:bg-neutral-950 hover:bg-neutral-50/90 dark:hover:bg-neutral-900/80 transition-colors duration-200 flex flex-col items-center justify-center gap-2 text-center aspect-square"
            :title="`Launch ${platform.name}`"
          >
            <UIcon
              :name="platform.logo"
              class="w-7 h-7 transition-transform duration-200 group-hover:scale-110"
              :style="{ color: platform.color }"
            />
            <span class="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 truncate w-full">
              {{ platform.name }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- FLAT BENTO GRID FEATURES SECTION WITH LINE DIVIDERS -->
    <section id="features" class="py-4 space-y-6">
      <div class="text-left space-y-2">
        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Engineered for Speed & Ergonomics
        </h2>
        <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Built on Nuxt 4 and Nuxt UI v3 to deliver immediate page hydration, dark mode, and zero tab clutter.
        </p>
      </div>

      <!-- Flat Bento Grid Shell -->
      <div class="rounded-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-200 dark:bg-neutral-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px">
        <div
          v-for="feature in LANDING_FEATURES"
          :key="feature.title"
          class="group p-6 sm:p-8 bg-white dark:bg-neutral-950 hover:bg-neutral-50/80 dark:hover:bg-neutral-900/60 transition-colors duration-200 flex flex-col justify-between text-left"
        >
          <div>
            <div class="flex items-center justify-between mb-6">
              <div class="p-2 rounded-xs bg-primary-500/10 text-primary-500 group-hover:scale-105 transition-transform duration-200">
                <UIcon :name="feature.icon" class="w-6 h-6" />
              </div>
              <UBadge
                v-if="feature.badge"
                variant="subtle"
                size="xs"
                color="neutral"
                class="font-mono text-[10px] uppercase tracking-wider rounded-xs"
              >
                {{ feature.badge }}
              </UBadge>
            </div>

            <h3 class="font-bold text-base text-neutral-900 dark:text-white mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3-ROW FLAT GRID MARQUEE SHOWCASE SECTION -->
    <section id="showcase" class="space-y-6 overflow-hidden">
      <div class="text-left space-y-2">
        <UBadge
          color="primary"
          variant="subtle"
          size="sm"
          class="font-semibold rounded-xs"
        >
          Live Directory Showcase
        </UBadge>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Supported Social Channels & Developer Tools
        </h2>
        <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Hover over any row to pause marquee scrolling. Launch platforms directly from your workspace.
        </p>
      </div>

      <!-- Flat Marquee Strips Container -->
      <div class="relative w-full overflow-hidden py-2 space-y-3">
        <!-- Side Fade Overlays -->
        <div class="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-16 sm:w-36 bg-linear-to-r from-neutral-50 dark:from-neutral-950 to-transparent" />
        <div class="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-16 sm:w-36 bg-linear-to-l from-neutral-50 dark:from-neutral-950 to-transparent" />

        <!-- ROW 1: Flat Scrolling Left Track -->
        <div class="marquee-row group flex overflow-hidden border-y border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          <div class="animate-marquee-left flex">
            <div
              v-for="(platform, idx) in [...row1Platforms, ...row1Platforms]"
              :key="`row1-${platform.id}-${idx}`"
              class="group/card relative flex flex-col justify-between w-72 sm:w-80 shrink-0 p-5 border-r border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50/90 dark:hover:bg-neutral-900/60 transition-colors text-left"
              @mouseenter="hoveredPlatformId = `r1-${platform.id}-${idx}`"
              @mouseleave="hoveredPlatformId = null"
            >
              <div
                class="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
                :style="{ backgroundColor: platform.color, opacity: hoveredPlatformId === `r1-${platform.id}-${idx}` ? 1 : 0 }"
              />
              <div>
                <div class="flex items-start justify-between mb-3.5">
                  <div class="flex items-center gap-3 min-w-0">
                    <UIcon
                      :name="platform.logo"
                      class="w-7 h-7 shrink-0 transition-transform duration-300 group-hover/card:scale-110"
                      :style="{ color: platform.color }"
                    />
                    <div class="min-w-0">
                      <h3 class="font-bold text-neutral-900 dark:text-white text-sm leading-tight truncate">
                        {{ platform.name }}
                      </h3>
                      <span class="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-bold">
                        {{ platform.category }}
                      </span>
                    </div>
                  </div>
                  <UBadge
                    v-if="platform.badge"
                    variant="subtle"
                    size="xs"
                    class="shrink-0 text-[9px] uppercase font-mono font-bold rounded-xs"
                    :style="{ color: platform.color, borderColor: `${platform.color}40`, backgroundColor: `${platform.color}15` }"
                  >
                    {{ platform.badge }}
                  </UBadge>
                </div>
                <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4 leading-relaxed font-normal">
                  {{ platform.description }}
                </p>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                <div class="flex gap-1 flex-wrap">
                  <span
                    v-for="tag in platform.tags.slice(0, 2)"
                    :key="tag"
                    class="text-[10px] px-2 py-0.5 rounded-xs bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 font-medium"
                  >
                    {{ tag }}
                  </span>
                </div>
                <UButton
                  :to="user ? '/dashboard' : '/login'"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  :icon="user ? 'i-lucide-arrow-right' : 'i-lucide-lock'"
                  trailing
                  class="transition-colors duration-200 rounded-xs"
                  :style="{ color: hoveredPlatformId === `r1-${platform.id}-${idx}` ? platform.color : undefined }"
                >
                  {{ user ? 'Launch' : 'Sign in' }}
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- ROW 2: Flat Scrolling Right Track -->
        <div class="marquee-row group flex overflow-hidden border-y border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          <div class="animate-marquee-right flex">
            <div
              v-for="(platform, idx) in [...row2Platforms, ...row2Platforms]"
              :key="`row2-${platform.id}-${idx}`"
              class="group/card relative flex flex-col justify-between w-72 sm:w-80 shrink-0 p-5 border-r border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50/90 dark:hover:bg-neutral-900/60 transition-colors text-left"
              @mouseenter="hoveredPlatformId = `r2-${platform.id}-${idx}`"
              @mouseleave="hoveredPlatformId = null"
            >
              <div
                class="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
                :style="{ backgroundColor: platform.color, opacity: hoveredPlatformId === `r2-${platform.id}-${idx}` ? 1 : 0 }"
              />
              <div>
                <div class="flex items-start justify-between mb-3.5">
                  <div class="flex items-center gap-3 min-w-0">
                    <UIcon
                      :name="platform.logo"
                      class="w-7 h-7 shrink-0 transition-transform duration-300 group-hover/card:scale-110"
                      :style="{ color: platform.color }"
                    />
                    <div class="min-w-0">
                      <h3 class="font-bold text-neutral-900 dark:text-white text-sm leading-tight truncate">
                        {{ platform.name }}
                      </h3>
                      <span class="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-bold">
                        {{ platform.category }}
                      </span>
                    </div>
                  </div>
                  <UBadge
                    v-if="platform.badge"
                    variant="subtle"
                    size="xs"
                    class="shrink-0 text-[9px] uppercase font-mono font-bold rounded-xs"
                    :style="{ color: platform.color, borderColor: `${platform.color}40`, backgroundColor: `${platform.color}15` }"
                  >
                    {{ platform.badge }}
                  </UBadge>
                </div>
                <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4 leading-relaxed font-normal">
                  {{ platform.description }}
                </p>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                <div class="flex gap-1 flex-wrap">
                  <span
                    v-for="tag in platform.tags.slice(0, 2)"
                    :key="tag"
                    class="text-[10px] px-2 py-0.5 rounded-xs bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 font-medium"
                  >
                    {{ tag }}
                  </span>
                </div>
                <UButton
                  :to="user ? '/dashboard' : '/login'"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  :icon="user ? 'i-lucide-arrow-right' : 'i-lucide-lock'"
                  trailing
                  class="transition-colors duration-200 rounded-xs"
                  :style="{ color: hoveredPlatformId === `r2-${platform.id}-${idx}` ? platform.color : undefined }"
                >
                  {{ user ? 'Launch' : 'Sign in' }}
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- ROW 3: Flat Scrolling Left Track -->
        <div class="marquee-row group flex overflow-hidden border-y border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          <div class="animate-marquee-left flex">
            <div
              v-for="(platform, idx) in [...row3Platforms, ...row3Platforms]"
              :key="`row3-${platform.id}-${idx}`"
              class="group/card relative flex flex-col justify-between w-72 sm:w-80 shrink-0 p-5 border-r border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50/90 dark:hover:bg-neutral-900/60 transition-colors text-left"
              @mouseenter="hoveredPlatformId = `r3-${platform.id}-${idx}`"
              @mouseleave="hoveredPlatformId = null"
            >
              <div
                class="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
                :style="{ backgroundColor: platform.color, opacity: hoveredPlatformId === `r3-${platform.id}-${idx}` ? 1 : 0 }"
              />
              <div>
                <div class="flex items-start justify-between mb-3.5">
                  <div class="flex items-center gap-3 min-w-0">
                    <UIcon
                      :name="platform.logo"
                      class="w-7 h-7 shrink-0 transition-transform duration-300 group-hover/card:scale-110"
                      :style="{ color: platform.color }"
                    />
                    <div class="min-w-0">
                      <h3 class="font-bold text-neutral-900 dark:text-white text-sm leading-tight truncate">
                        {{ platform.name }}
                      </h3>
                      <span class="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-bold">
                        {{ platform.category }}
                      </span>
                    </div>
                  </div>
                  <UBadge
                    v-if="platform.badge"
                    variant="subtle"
                    size="xs"
                    class="shrink-0 text-[9px] uppercase font-mono font-bold rounded-xs"
                    :style="{ color: platform.color, borderColor: `${platform.color}40`, backgroundColor: `${platform.color}15` }"
                  >
                    {{ platform.badge }}
                  </UBadge>
                </div>
                <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4 leading-relaxed font-normal">
                  {{ platform.description }}
                </p>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                <div class="flex gap-1 flex-wrap">
                  <span
                    v-for="tag in platform.tags.slice(0, 2)"
                    :key="tag"
                    class="text-[10px] px-2 py-0.5 rounded-xs bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 font-medium"
                  >
                    {{ tag }}
                  </span>
                </div>
                <UButton
                  :to="user ? '/dashboard' : '/login'"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  :icon="user ? 'i-lucide-arrow-right' : 'i-lucide-lock'"
                  trailing
                  class="transition-colors duration-200 rounded-xs"
                  :style="{ color: hoveredPlatformId === `r3-${platform.id}-${idx}` ? platform.color : undefined }"
                >
                  {{ user ? 'Launch' : 'Sign in' }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
