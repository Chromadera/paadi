import { create } from "zustand";
import { persist } from "zustand/middleware";
import { secureStoreAdapter } from "../storage";
import type { PersistStorage } from "zustand/middleware";

type SessionState = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  hydrated: boolean;

  setSession: (session: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }) => void;
  clearSession: () => void;
  isAuthenticated: () => boolean;
  setHydrated: (hydrated: boolean) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      hydrated: false,

      setSession: ({ accessToken, refreshToken, expiresIn }) => {
        set({
          accessToken,
          refreshToken,
          expiresAt: Date.now() + expiresIn * 1000,
        });
      },

      clearSession: () => {
        set({ accessToken: null, refreshToken: null, expiresAt: null });
      },

      isAuthenticated: () => {
        const { accessToken, expiresAt } = get();
        return (
          Boolean(accessToken) &&
          Boolean(expiresAt) &&
          Date.now() < expiresAt!
        );
      },

      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "paadi-session",
      storage: secureStoreAdapter as unknown as PersistStorage<SessionState>,
    }
  )
);
