<!-- app/components/dashboard/add-platform-modal.vue -->
<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  categories: Array<{ label: string; value: string; icon: string; id?: string }>;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "created"): void;
}>();

const { createCustomPlatform } = useDashboard();
const { apiFetch } = useApi();

const form = reactive({
  name: "",
  url: "",
  categoryId: "",
  description: "",
  color: "#6366F1",
  logo: "i-lucide-globe",
});

const isSubmitting = ref(false);
const rawCategories = ref<Array<{ id: string; name: string }>>([]);

onMounted(async () => {
  try {
    const platforms = await apiFetch<Array<{ category?: { id: string; name: string } }>>("/platforms");
    const categories = new Map<string, { id: string; name: string }>();
    platforms.forEach((platform) => {
      if (platform.category)
        categories.set(platform.category.id, platform.category);
    });
    rawCategories.value = [
      ...categories.values(),
    ];
    form.categoryId = rawCategories.value[0]?.id || "";
  }
  catch (error) {
    console.error("[ADD PLATFORM] Failed to load categories:", error);
  }
});

async function handleSubmit() {
  if (!form.name || !form.url || !form.categoryId)
    return;

  isSubmitting.value = true;
  try {
    await createCustomPlatform({
      name: form.name,
      url: form.url,
      categoryId: form.categoryId,
      description: form.description,
      color: form.color,
      logo: form.logo,
    });
    emit("created");
    emit("update:open", false);
    form.name = "";
    form.url = "";
    form.description = "";
  }
  catch (error) {
    console.error("[ADD PLATFORM] Failed to create custom platform:", error);
  }
  finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <UModal
    :open="open"
    title="Add Private Custom App Shortcut"
    description="Create a custom endpoint shortcut accessible inside your workspace."
    @update:open="value => emit('update:open', value)"
  >
    <template #body>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <!-- Card Live Preview -->
        <div class="p-3 bg-neutral-100/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 rounded-xs flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xs bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800">
              <UIcon
                :name="form.logo || 'i-lucide-globe'"
                class="w-6 h-6"
                :style="{ color: form.color }"
              />
            </div>
            <div>
              <h4 class="font-bold text-xs text-neutral-900 dark:text-white">
                {{ form.name || 'Custom Application Name' }}
              </h4>
              <p class="text-[11px] text-neutral-400 truncate max-w-[220px]">
                {{ form.url || 'https://app.example.com' }}
              </p>
            </div>
          </div>
          <UBadge
            color="warning"
            variant="subtle"
            size="xs"
            class="font-mono rounded-xs"
          >
            Private App
          </UBadge>
        </div>

        <UFormField label="Platform Name" required>
          <UInput
            v-model="form.name"
            placeholder="e.g. Internal Admin Portal"
            icon="i-lucide-layout"
            required
            class="rounded-xs"
          />
        </UFormField>

        <UFormField label="Target Web Address (URL)" required>
          <UInput
            v-model="form.url"
            type="url"
            placeholder="https://admin.company.com"
            icon="i-lucide-link"
            required
            class="rounded-xs"
          />
        </UFormField>

        <UFormField label="Category" required>
          <select
            v-model="form.categoryId"
            class="w-full rounded-xs border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="" disabled>
              Select a category...
            </option>
            <option
              v-for="category in rawCategories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </UFormField>

        <UFormField label="Description">
          <UInput
            v-model="form.description"
            placeholder="Brief notes or description..."
            icon="i-lucide-file-text"
            class="rounded-xs"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-3">
          <UFormField label="Accent Color">
            <div class="flex items-center gap-2">
              <UInput
                v-model="form.color"
                type="color"
                class="h-9 w-14 cursor-pointer p-0.5 rounded-xs"
              />
              <UInput
                v-model="form.color"
                placeholder="#6366F1"
                class="rounded-xs font-mono text-xs flex-1"
              />
            </div>
          </UFormField>

          <UFormField label="Icon Class">
            <UInput
              v-model="form.logo"
              placeholder="i-lucide-globe"
              icon="i-lucide-smile"
              class="rounded-xs font-mono text-xs"
            />
          </UFormField>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60">
          <UButton
            color="neutral"
            variant="ghost"
            type="button"
            class="rounded-xs"
            @click="emit('update:open', false)"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            color="primary"
            class="font-bold rounded-xs shadow-xs"
            :loading="isSubmitting"
            icon="i-lucide-plus"
          >
            Create Custom Shortcut
          </UButton>
        </div>
      </form>
    </template>
  </UModal>
</template>
