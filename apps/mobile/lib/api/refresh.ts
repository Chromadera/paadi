import { publicClient } from "./client";
import { useSessionStore } from "@/lib/auth/session";

let inflightRefresh: Promise<boolean> | null = null;

export async function tryRefresh(): Promise<boolean> {
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
      clearSession();
      return false;
    } finally {
      inflightRefresh = null;
    }
  })();

  return inflightRefresh;
}
