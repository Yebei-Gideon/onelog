// app/types/auth.ts
export type User = {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  googleId?: string | null;
  createdAt?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
};

export type AuthResponse = {
  user: User;
  tokens: AuthTokens;
};