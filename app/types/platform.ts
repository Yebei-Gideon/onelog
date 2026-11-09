// app/types/platform.ts
export type PlatformCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
};

export type PlatformStatus = {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
};

export type SocialPlatform = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  url: string;
  color: string;
  badge?: string | null;
  monthlyUsers?: string | null;
  isFeatured: boolean;
  isCustom?: boolean;
  userId?: string | null;
  tags: string[];
  category: PlatformCategory;
  status?: PlatformStatus | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PlatformCategoryFilter = string;
export type ViewMode = "grid" | "list";