import { publicClient } from "./client";
import { useSessionStore } from "@/lib/auth/session";

/**
 * Attempts a silent token refresh using the stored refreshToken.
 *
 * Returns true if a new access token was successfully obtained and stored.
 * Returns false (and clears the session) if the refresh token is missing,
 * expired, or the server rejects it.
 *
 * Called by the React Query error handler (query-client.ts) when a 401
 * is received on an authenticated request, before giving up.
 *
 * Design note: we use a module-level promise to collapse concurrent 401s
 * into a single refresh call — if three queries fail simultaneously, only
 * one POST /auth/refresh fires, and the other two await the same result.
 */
let inflightRefresh: Promise<boolean> | null = null;

export async function tryRefresh(): Promise<boolean> {
  // Collapse concurrent calls — only one refresh at a time
  if (inflightRefresh) return inflightRefresh;

  inflightRefresh = (async () => {
    const { refreshToken, setSession, clearSession } =
      useSessionStore.getState();

    if (!refreshToken) {
      clearSession();
      return false;
    }

    try {
      const session = await publicClient.refresh({ refreshToken });
      setSession(session);
      return true;
    } catch {
      // Refresh rejected (401) or network error — log out
      clearSession();
      return false;
    } finally {
      inflightRefresh = null;
    }
  })();

  return inflightRefresh;
}
