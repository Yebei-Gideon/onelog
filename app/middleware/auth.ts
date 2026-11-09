// app/middleware/auth.ts
export default defineNuxtRouteMiddleware((_to) => {
  const { loggedIn } = useAuth();

  if (!loggedIn.value) {
    return navigateTo("/login");
  }
});