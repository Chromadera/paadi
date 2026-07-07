import { QueryClient } from "@tanstack/react-query";
import { PaadiApiError } from "@paadi/api-client";
import { tryRefresh } from "@/lib/api/refresh";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnReconnect: false,
      retry: (failureCount, error) => {
        if (
          error instanceof PaadiApiError &&
          error.statusCode != null &&
          error.statusCode < 500
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: (failureCount, error) => {
        if (
          error instanceof PaadiApiError &&
          error.statusCode != null &&
          error.statusCode < 500
        ) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});

// Global 401 handler
queryClient.getQueryCache().subscribe((event) => {
  if (
    event.type === "observerResultsUpdated" ||
    event.type === "updated"
  ) {
    const error = event.query?.state.error;
    if (error instanceof PaadiApiError && error.statusCode === 401) {
      tryRefresh().then((refreshed) => {
        if (refreshed) {
          queryClient.invalidateQueries();
        }
      });
    }
  }
});
