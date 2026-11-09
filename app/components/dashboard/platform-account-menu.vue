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
</script>

<template>
  <div class="flex items-center">
    <UButton
      color="primary"
      variant="solid"
      size="xs"
      icon="i-lucide-external-link"
      trailing
      class="font-bold rounded-xs shadow-2xs"
      @click="handlePrimaryAction"
    >
      {{ accounts.length ? "Launch" : "Sign in" }}
    </UButton>
    <UDropdownMenu
      :items="[
        ...accounts.map(account => ({ label: account.label, icon: 'i-lucide-user-round', onSelect: () => emit('launch', account) })),
        { type: 'separator' },
        { label: 'Add account', icon: 'i-lucide-plus', onSelect: () => isAddOpen = true },
      ]"
    >
      <UButton
        color="primary"
        variant="solid"
        icon="i-lucide-chevron-down"
        size="xs"
        aria-label="Choose platform account"
        class="rounded-l-none border-l border-primary-300/50"
      />
    </UDropdownMenu>
  </div>

  <UModal v-model:open="isAddOpen" title="Add platform account" description="Only the local account label is saved. Login cookies remain in the platform webview profile.">
    <template #body>
      <form class="space-y-4" @submit.prevent="addAccount">
        <UFormField label="Account label" required>
          <UInput v-model="label" placeholder="Personal, Work, Creator..." autofocus />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="isAddOpen = false">Cancel</UButton>
          <UButton type="submit" color="primary">Add account</UButton>
        </div>
      </form>
    </template>
  </UModal>
</template>
