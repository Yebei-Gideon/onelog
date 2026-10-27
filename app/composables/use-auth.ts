// app/composables/use-auth.ts
export function useAuth() {
  const { user, loggedIn, session, clear, fetch: fetchSession } = useUserSession();
  const router = useRouter();

  const login = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    console.log("[CLIENT AUTH] Sending login request for:", credentials.email);
    try {
      const res = await $fetch("/api/auth/login", {
        method: "POST",
        body: credentials,
      });
      console.log("[CLIENT AUTH] Login API response:", res);

      await fetchSession();
      console.log("[CLIENT AUTH] Session refreshed. User:", user.value);

      await router.push("/dashboard");
      return res;
    }
    catch (err: any) {
      console.error("[CLIENT AUTH ERROR] Login failed:", err?.data || err);
      throw err;
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    console.log("[CLIENT AUTH] Sending register request for:", data.email);
    try {
      const res = await $fetch("/api/auth/register", {
        method: "POST",
        body: data,
      });
      console.log("[CLIENT AUTH] Register API response:", res);

      await fetchSession();
      console.log("[CLIENT AUTH] Session refreshed. User:", user.value);

      await router.push("/dashboard");
      return res;
    }
    catch (err: any) {
      console.error("[CLIENT AUTH ERROR] Registration failed:", err?.data || err);
      throw err;
    }
  };

  const logout = async () => {
    console.log("[CLIENT AUTH] Logging out...");
    try {
      await $fetch("/api/auth/logout", { method: "POST" });
    }
    catch (err) {
      console.error("[CLIENT AUTH ERROR] Logout API failed:", err);
    }
    finally {
      await clear();
      await router.push("/login");
    }
  };

  const navigateToDashboardIfLoggedIn = () => {
    if (loggedIn.value) {
      console.log("[CLIENT AUTH] User already authenticated, redirecting to /dashboard");
      return navigateTo("/dashboard");
    }
  };

  return {
    user,
    loggedIn,
    session,
    login,
    register,
    logout,
    fetchSession,
    navigateToDashboardIfLoggedIn,
  };
}
