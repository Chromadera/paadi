import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthedClient } from "@/lib/api/client";
import { useSessionStore } from "@/lib/auth/session";

/**
 * Profile, PIN, and logout hooks — all Bearer-authenticated.
 *
 * getAuthedClient() reads the live accessToken from useSessionStore on
 * every call, so a token refresh is automatically picked up without
 * needing to re-render or recreate the client.
 *
 * Sibling files:
 *   notifications-hooks.ts (notification preferences)
 *   payout-hooks.ts        (bank accounts)
 */

// ---- read current user ----

export function useMe() {
  const accessToken = useSessionStore((s) => s.accessToken);

  return useQuery({
    queryKey: ["me"],
    queryFn: () => getAuthedClient().getMe(),
    // Don't fire if there's no session — avoids a guaranteed-to-fail 401
    // on logged-out routes someone navigated to directly
    enabled: Boolean(accessToken),
  });
}

// ---- profile ----

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: {
      displayName?: string;
      avatarUrl?: string;
      firstName?: string;
      lastName?: string;
    }) => getAuthedClient().updateProfile(req),
    onSuccess: () => {
      // Invalidate rather than manually patch — getMe() will refetch and
      // pick up the change. Simpler and less error-prone than hand-merging
      // the response into the existing ["me"] cache entry.
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useChangeUsername() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) =>
      getAuthedClient().changeUsername({ username }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

// ---- PIN ----

export function useVerifyPin() {
  return useMutation({
    mutationFn: (pin: string) => getAuthedClient().verifyPin({ pin }),
  });
}

export function useChangePin() {
  return useMutation({
    mutationFn: ({
      currentPin,
      newPin,
    }: {
      currentPin: string;
      newPin: string;
    }) => getAuthedClient().changePin({ currentPin, newPin }),
  });
}

// ---- logout ----

export function useLogout() {
  const clearSession = useSessionStore((s) => s.clearSession);

  return useMutation({
    mutationFn: () => getAuthedClient().logout(),
    onSuccess: () => {
      // Clear the local session regardless — even if the server call
      // somehow fails, there's no good reason to leave stale tokens
      // sitting in this browser once the user has asked to log out.
      clearSession();
    },
    onError: () => {
      // Always clear locally on error too — a failed logout should still
      // remove the user from the authenticated state.
      clearSession();
    },
  });
}

export function useLogoutAll() {
  const clearSession = useSessionStore((s) => s.clearSession);

  return useMutation({
    mutationFn: () => getAuthedClient().logoutAll(),
    onSuccess: () => {
      clearSession();
    },
    onError: () => {
      clearSession();
    },
  });
}

// ---- Email Verification ----

export function useEmailStart() {
  return useMutation({
    mutationFn: (email: string) => getAuthedClient().emailStart({ email }),
  });
}

export function useEmailVerify() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => getAuthedClient().emailVerify({ code }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}