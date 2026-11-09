// app/composables/use-api.ts
let refreshPromise: Promise<any> | null = null;

export function useApi() {
  const config = useRuntimeConfig();
  const accessToken = useCookie<string | null>("auth_access_token", { default: () => null });
  const refreshToken = useCookie<string | null>("auth_refresh_token", { default: () => null });
  const sessionId = useCookie<string | null>("auth_session_id", { default: () => null });
  const user = useCookie<any | null>("auth_user", { default: () => null });

  function getStoredSession() {
    if (!import.meta.client)
      return null;
    try {
      return JSON.parse(localStorage.getItem("onelog_auth_session") || "null") as {
        user?: { id?: string };
        tokens?: { accessToken?: string; refreshToken?: string; sessionId?: string };
      } | null;
    }
    catch {
      return null;
    }
  }

  function getAccessToken() {
    return accessToken.value || getStoredSession()?.tokens?.accessToken || null;
  }

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBaseUrl as string,

    onRequest({ options }) {
      const token = getAccessToken();
      if (token) {
        const headers = new Headers(options.headers);
        headers.set("Authorization", `Bearer ${token}`);
        options.headers = headers;
      }
    },

    async onResponseError({ request, response, options }) {
      // Intercept 401 Unauthorized errors for automatic refresh
      const storedSession = getStoredSession();
      const currentRefreshToken = refreshToken.value || storedSession?.tokens?.refreshToken;
      const currentSessionId = sessionId.value || storedSession?.tokens?.sessionId;
      const currentUserId = user.value?.id || storedSession?.user?.id;

      if (response.status === 401 && currentRefreshToken && currentSessionId && currentUserId) {
        try {
          // Mutex lock: reusable shared promise if a refresh is already in flight
          if (!refreshPromise) {
            refreshPromise = $fetch<{ accessToken: string; refreshToken: string; sessionId: string }>(
              `${config.public.apiBaseUrl}/auth/refresh`,
              {
                method: "POST",
                body: {
                  userId: currentUserId,
                  sessionId: currentSessionId,
                  refreshToken: currentRefreshToken,
                },
              },
            ).finally(() => {
              refreshPromise = null;
            });
          }

          const res = await refreshPromise;

          // Sync refreshed tokens to cookies
          accessToken.value = res.accessToken;
          refreshToken.value = res.refreshToken;
          sessionId.value = res.sessionId;
          if (import.meta.client) {
            const session = getStoredSession();
            localStorage.setItem("onelog_auth_session", JSON.stringify({
              user: user.value || session?.user,
              tokens: res,
            }));
          }

          // Retry original request with newly rotated token
          const headers = new Headers(options.headers);
          headers.set("Authorization", `Bearer ${res.accessToken}`);
          return await $fetch(request, {
            headers,
            method: options.method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
          });
        }
        catch (refreshErr) {
          // Session revoked or expired — clear state and force login
          accessToken.value = null;
          refreshToken.value = null;
          sessionId.value = null;
          user.value = null;
          if (import.meta.client)
            localStorage.removeItem("onelog_auth_session");
          await navigateTo("/login");
          throw refreshErr;
        }
      }
    },
  });

  return { apiFetch };
}