import { QueryClient } from "@tanstack/react-query";
import { PaadiApiError } from "@paadi/api-client";
import { tryRefresh } from "@/lib/api/refresh";

/**
 * Global React Query client.
 *
 * On any query/mutation error:
 *   - If the error is a 401 from the real API, attempt a silent token refresh.
 *   - If refresh succeeds, invalidate all queries so they re-run with the new token.
 *   - If refresh fails, tryRefresh() already called clearSession(), so the
 *     splash router at / will redirect to /welcome on the next render.
 *
 * This means authenticated screens never need to handle 401 manually —
 * it's either silently recovered, or the user is logged out.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      // Don't auto-retry 4xx errors — they're not transient
      retry: (failureCount, error) => {
        if (error instanceof PaadiApiError && error.statusCode != null && error.statusCode < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      // Same — don't retry client errors
      retry: (failureCount, error) => {
        if (error instanceof PaadiApiError && error.statusCode != null && error.statusCode < 500) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});

// Global 401 handler — wires into the QueryCache event bus
queryClient.getQueryCache().subscribe((event) => {
  if (
    event.type === "observerResultsUpdated" ||
    event.type === "updated"
  ) {
    const error = event.query?.state.error;
    if (error instanceof PaadiApiError && error.statusCode === 401) {
      tryRefresh().then((refreshed) => {
        if (refreshed) {
          // Re-run all active queries with the new token
          queryClient.invalidateQueries();
        }
        // If not refreshed, clearSession() already ran — UI will redirect
      });
    }
  }
});