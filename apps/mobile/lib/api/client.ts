import { createClient, PaadiClient } from "@paadi/api-client";
import { useSessionStore } from "@/lib/auth/session";
import { API_BASE_URL } from "./url";

export const publicClient: PaadiClient = createClient({ baseUrl: API_BASE_URL });

export function getAuthedClient(): PaadiClient {
  const token = useSessionStore.getState().accessToken ?? undefined;
  return createClient({ baseUrl: API_BASE_URL, token });
}
