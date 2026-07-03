import { createClient, PaadiClient } from "@paadi/api-client";
import { useSessionStore } from "@/lib/auth/session";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Unauthenticated client for public routes:
 *   - All /auth/signup/* steps
 *   - /auth/login, /auth/refresh, /auth/forgot-password, /auth/reset-password
 *   - GET /pay/:token
 *   - GET /auth/username/available
 *
 * Import this in hooks that talk to @Public endpoints.
 */
export const publicClient: PaadiClient = createClient({ baseUrl: BASE_URL });

/**
 * Returns a PaadiClient with the current session's accessToken attached.
 *
 * Usage in queryFn / mutationFn:
 *   const client = getAuthedClient();
 *   return client.getMe();
 *
 * Intentionally uses `.getState()` (not a React selector) so it can be
 * called inside React Query callbacks, which run outside the render cycle.
 * The token is read fresh on every call, so a refresh that writes a new
 * token into the store is automatically picked up on the next request.
 */
export function getAuthedClient(): PaadiClient {
  const token = useSessionStore.getState().accessToken ?? undefined;
  return createClient({ baseUrl: BASE_URL, token });
}
