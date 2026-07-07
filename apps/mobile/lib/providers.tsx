import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query-client";
import { useSessionStore } from "./auth/session";

export function Providers({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const rehydrate = async () => {
      await useSessionStore.persist.rehydrate();
      useSessionStore.getState().setHydrated(true);
      setHydrated(true);
    };
    rehydrate();
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
