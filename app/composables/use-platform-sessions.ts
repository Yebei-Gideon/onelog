export type PlatformAccount = {
  id: string;
  platformId: string;
  workspaceId: string;
  label: string;
  partitionId: string;
  createdAt: string;
  lastUsedAt: string;
};

const storageKey = "onelog-platform-accounts";

export function usePlatformSessions() {
  const accounts = useState<PlatformAccount[]>("platform-accounts", () => []);

  function load() {
    if (!import.meta.client)
      return;
    try {
      accounts.value = JSON.parse(localStorage.getItem(storageKey) || "[]") as PlatformAccount[];
    }
    catch {
      accounts.value = [];
    }
  }

  function save() {
    if (import.meta.client)
      localStorage.setItem(storageKey, JSON.stringify(accounts.value));
  }

  function forPlatform(platformId: string, workspaceId: string) {
    return computed(() => accounts.value.filter(account => account.platformId === platformId && account.workspaceId === workspaceId));
  }

  function addAccount(platformId: string, workspaceId: string, label: string) {
    const now = new Date().toISOString();
    const account: PlatformAccount = {
      id: crypto.randomUUID(),
      platformId,
      workspaceId,
      label: label.trim() || "New account",
      partitionId: `onelog_${workspaceId}_${platformId}_${crypto.randomUUID()}`,
      createdAt: now,
      lastUsedAt: now,
    };
    accounts.value.push(account);
    save();
    return account;
  }

  function touchAccount(id: string) {
    const account = accounts.value.find(item => item.id === id);
    if (account) {
      account.lastUsedAt = new Date().toISOString();
      save();
    }
  }

  function removeAccount(id: string) {
    accounts.value = accounts.value.filter(account => account.id !== id);
    save();
  }

  return { accounts, load, save, forPlatform, addAccount, touchAccount, removeAccount };
}
