// app/types/platform.ts
export type PlatformCategory
  = | "social"
    | "developer"
    | "content"
    | "messaging"
    | "professional";

export type PlatformCategoryFilter = PlatformCategory | "all";

export type PlatformStatus = "active" | "beta" | "trending";

export type CategoryOption = {
  label: string;
  value: PlatformCategoryFilter;
  icon: string;
};

export type SocialPlatform = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  category: PlatformCategory;
  url: string;
  isFeatured?: boolean;
  tags: string[];
  color: string; // Brand Hex Color (e.g., '#1DA1F2')
  badge?: string;
  status?: PlatformStatus;
  monthlyUsers?: string;
};

export type ViewMode = "grid" | "list";
