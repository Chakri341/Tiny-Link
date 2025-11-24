export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // server side
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return process.env.NEXT_PUBLIC_BASE_URL!;
}
