// app/types/auth.ts
export type UserProfile = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: "credentials" | "google" | "facebook" | "github" | "apple";
  createdAt: string;
};

declare module "#auth-utils" {
  type User = {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    provider: "credentials" | "google" | "facebook" | "github" | "apple";
    createdAt: string;
  };
}
