// app/types/workspace.ts
export type ShellEnvironment = "tauri" | "electron" | "capacitor" | "web";

export type WorkspacePlatformItem = {
  id: string;
  workspaceId: string;
  platformSlug: string;
  customUrl?: string | null;
  partitionId: string;
  displayOrder: number;
};

export type Workspace = {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  platforms: WorkspacePlatformItem[];
};
