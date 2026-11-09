<!-- app/components/dashboard/platform-account-menu.vue -->
<script setup lang="ts">
import type { PlatformAccount } from "~/composables/use-platform-sessions";

const props = defineProps<{
  platformId: string;
  workspaceId: string;
  accounts: PlatformAccount[];
}>();

const emit = defineEmits<{
  launch: [account: PlatformAccount];
  add: [label: string];
}>();

const isAddOpen = ref(false);
const label = ref("");

function addAccount() {
  if (!label.value.trim())
    return;
  emit("add", label.value);
  label.value = "";
  isAddOpen.value = false;
}

function handlePrimaryAction() {
  if (props.accounts[0])
    emit("launch", props.accounts[0]);
  else
    isAddOpen.value = true;
}

const dropdownItems = computed(() => [
  ...props.accounts.map(account => ({
    label: account.label,
    icon: "i-lucide-user-check",
    onSelect: () => emit("launch", account),
  })),
  { type: "separator" as const },
  {
    label: "Add new profile account",
    icon: "i-lucide-user-plus",
    onSelect: () => isAddOpen.value = true,
  },
]);
</script>

<template>
  <div class="inline-flex items-center shadow-2xs rounded-xs overflow-hidden border border-primary-600/20">
    <UButton
      color="primary"
      variant="solid"
      size="xs"
      icon="i-lucide-external-link"
      trailing
      class="font-bold rounded-none px-3"
      @click="handlePrimaryAction"
    >
      {{ accounts.length ? "Launch" : "Sign in" }}
    </UButton>

    <UDropdownMenu :items="dropdownItems">
      <UButton
        color="primary"
        variant="solid"
        icon="i-lucide-chevron-down"
        size="xs"
        aria-label="Choose platform account profile"
        class="rounded-none border-l border-primary-400/40 px-1.5"
      />
    </UDropdownMenu>
  </div>

  <UModal
    v-model:open="isAddOpen"
    title="Add Platform Account Profile"
    description="Isolated cookies and storage per profile account partition."
  >
    <template #body>
      <form class="space-y-4" @submit.prevent="addAccount">
        <UFormField label="Account Profile Label" required>
          <UInput
            v-model="label"
            placeholder="e.g. Personal Account, Work Profile, Client Admin..."
            icon="i-lucide-user"
            autofocus
            class="rounded-xs"
          />
        </UFormField>
        <div class="flex justify-end gap-2 pt-2">
          <UButton
            color="neutral"
            variant="ghost"
            class="rounded-xs"
            @click="isAddOpen = false"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            color="primary"
            class="font-bold rounded-xs shadow-xs"
            icon="i-lucide-plus"
          >
            Save & Launch Account
          </UButton>
        </div>
      </form>
    </template>
  </UModal>
</template>
