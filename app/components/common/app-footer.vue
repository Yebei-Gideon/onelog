<!-- app/components/common/app-footer.vue -->
<template>
  <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-colors text-left">
    <UContainer class="py-10 sm:py-12">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <!-- Brand Info & Logo -->
        <div class="space-y-3 max-w-md">
          <NuxtLink to="/" class="focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm inline-flex items-center">
            <CommonAppLogo size="lg" />
          </NuxtLink>
          <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
            OneLog is a platform that allows you to manage and organize your social media accounts in one place. It provides a unified dashboard for easy access to your favorite platforms, helping you stay connected and productive.
          </p>
        </div>

        <!-- Copyright & Social Links -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 pt-6 md:pt-0 border-t md:border-t-0 border-neutral-200/80 dark:border-neutral-800/80">
          <p>© {{ new Date().getFullYear() }} OneLog. All rights reserved.</p>
          <div class="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-sm bg-neutral-100 dark:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <UIcon name="i-lucide-github" class="w-4.5 h-4.5" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-sm bg-neutral-100 dark:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-colors"
              aria-label="X (Twitter)"
            >
              <UIcon name="i-lucide-twitter" class="w-4.5 h-4.5" />
            </a>
          </div>
        </div>
      </div>
    </UContainer>
  </footer>
</template>
