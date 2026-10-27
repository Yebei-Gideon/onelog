<!-- app/pages/index.vue -->
<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 gap-4">
    <h1 class="text-3xl font-bold text-emerald-400">
      OneLog Desktop App
    </h1>
    <p class="text-slate-400">
      Nuxt 4 + Nuxt UI v4 + Tauri v2
    </p>
    <div class="flex gap-3 mt-2">
      <UButton
        color="primary"
        variant="solid"
        icon="i-lucide-rocket"
      >
        Get Started
      </UButton>
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-github"
      >
        Docs
      </UButton>
    </div>
  </div>
</template>
