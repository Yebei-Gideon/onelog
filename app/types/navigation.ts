// app/types/navigation.ts
export type NavItem = {
  label: string;
  to: string;
  icon?: string;
  external?: boolean;
};

export type LandingFeature = {
  title: string;
  description: string;
  icon: string;
  badge?: string;
};
