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
  color: "#3B82F6",
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
    rawCategories.value = [...categories.values()];
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
    title="Add Private Custom Platform"
    description="Create a personal shortcut visible only to your account."
    @update:open="value => emit('update:open', value)"
  >
    <template #body>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <UFormField label="Platform Name" required>
          <UInput v-model="form.name" placeholder="e.g. Internal Admin Portal" required />
        </UFormField>
        <UFormField label="URL" required>
          <UInput v-model="form.url" type="url" placeholder="https://admin.company.com" required />
        </UFormField>
        <UFormField label="Category" required>
          <select
            v-model="form.categoryId"
            class="w-full rounded-xs border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="" disabled>
              Select a category
            </option>
            <option v-for="category in rawCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </UFormField>
        <UFormField label="Description">
          <UInput v-model="form.description" placeholder="Brief notes..." />
        </UFormField>
        <div class="grid grid-cols-2 gap-3">
          <UFormField label="Brand Color">
            <UInput v-model="form.color" type="color" class="h-9 w-full cursor-pointer" />
          </UFormField>
          <UFormField label="Icon Class">
            <UInput v-model="form.logo" placeholder="i-lucide-globe" />
          </UFormField>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <UButton color="neutral" variant="ghost" type="button" @click="emit('update:open', false)">
            Cancel
          </UButton>
          <UButton type="submit" color="primary" :loading="isSubmitting" icon="i-lucide-plus">
            Create Private Platform
          </UButton>
        </div>
      </form>
    </template>
  </UModal>
</template>
