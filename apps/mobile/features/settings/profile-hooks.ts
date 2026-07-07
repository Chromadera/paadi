import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthedClient } from "@/lib/api/client";
import { useSessionStore } from "@/lib/auth/session";

// ---- read current user ----

export function useMe() {
  const accessToken = useSessionStore((s) => s.accessToken);

  return useQuery({
    queryKey: ["me"],
    queryFn: () => getAuthedClient().getMe(),
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
      clearSession();
    },
    onError: () => {
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
