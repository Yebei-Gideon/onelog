// server/middleware/cors.ts
export default defineEventHandler((event) => {
  const origin = getHeader(event, "origin");

  if (origin) {
    setResponseHeader(event, "Access-Control-Allow-Origin", origin);
    setResponseHeader(event, "Access-Control-Allow-Credentials", "true");
    setResponseHeader(event, "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    setResponseHeader(event, "Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  }

  if (event.method === "OPTIONS") {
    setResponseStatus(event, 204);
    return "";
  }
});
