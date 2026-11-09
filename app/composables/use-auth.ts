// app/composables/use-auth.ts
export function useAuth() {
  const router = useRouter();
  const { apiFetch } = useApi();

  const accessToken = useCookie<string | null>("auth_access_token", { default: () => null });
  const refreshToken = useCookie<string | null>("auth_refresh_token", { default: () => null });
  const sessionId = useCookie<string | null>("auth_session_id", { default: () => null });
  const user = useCookie<any | null>("auth_user", { default: () => null });

  if (import.meta.client && !accessToken.value) {
    try {
      const stored = JSON.parse(localStorage.getItem("onelog_auth_session") || "null") as {
        user?: any;
        tokens?: { accessToken?: string; refreshToken?: string; sessionId?: string };
      } | null;
      if (stored?.tokens?.accessToken && stored.tokens.refreshToken && stored.tokens.sessionId && stored.user) {
        user.value = stored.user;
        accessToken.value = stored.tokens.accessToken;
        refreshToken.value = stored.tokens.refreshToken;
        sessionId.value = stored.tokens.sessionId;
      }
    }
    catch {
      localStorage.removeItem("onelog_auth_session");
    }
  }

  function persistSession(sessionData: {
    user: any;
    tokens: { accessToken: string; refreshToken: string; sessionId: string };
  }) {
    if (!import.meta.client)
      return;
    localStorage.setItem("onelog_auth_session", JSON.stringify(sessionData));
  }

  const loggedIn = computed(() => !!accessToken.value && !!user.value);

  const saveAuthSession = (sessionData: {
    user: any;
    tokens: { accessToken: string; refreshToken: string; sessionId: string };
  }) => {
    user.value = sessionData.user;
    accessToken.value = sessionData.tokens.accessToken;
    refreshToken.value = sessionData.tokens.refreshToken;
    sessionId.value = sessionData.tokens.sessionId;
    persistSession(sessionData);
  };

  const login = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    const res = await apiFetch<{ user: any; tokens: any }>("/auth/login", {
      method: "POST",
      body: credentials,
    });
    saveAuthSession(res);
    await router.push("/dashboard");
    return res;
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    const res = await apiFetch<{ user: any; tokens: any }>("/auth/register", {
      method: "POST",
      body: data,
    });
    saveAuthSession(res);
    await router.push("/dashboard");
    return res;
  };

  const logout = async () => {
    try {
      if (sessionId.value) {
        await apiFetch("/auth/logout", {
          method: "POST",
          body: { sessionId: sessionId.value },
        });
      }
    }
    catch (err) {
      console.error("[AUTH] Logout endpoint failed:", err);
    }
    finally {
      accessToken.value = null;
      refreshToken.value = null;
      sessionId.value = null;
      user.value = null;
      if (import.meta.client)
        localStorage.removeItem("onelog_auth_session");
      await router.push("/login");
    }
  };

  const navigateToDashboardIfLoggedIn = () => {
    if (loggedIn.value) {
      return navigateTo("/dashboard");
    }
  };

  return {
    user,
    loggedIn,
    login,
    register,
    logout,
    saveAuthSession,
    navigateToDashboardIfLoggedIn,
  };
}