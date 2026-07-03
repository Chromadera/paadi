import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthedClient } from "@/lib/api/client";

/**
 * Payout account hooks — all Bearer-authenticated.
 *
 * createPayoutAccount and deletePayoutAccount both take a `pin` and the
 * backend re-verifies it on that exact call — unlike the security page's
 * flow, there's no separate "verify, then act" step here. Screens built
 * on useCreatePayoutAccount / useDeletePayoutAccount need to handle
 * statusCode === 401 directly from THESE mutations to show "wrong PIN,"
 * not borrow useVerifyPin from profile-hooks.ts.
 */

export function useBanks() {
  return useQuery({
    queryKey: ["settings", "banks"],
    queryFn: () => getAuthedClient().getBanks(),
    staleTime: Infinity, // bank list essentially never changes mid-session
  });
}

export function usePayoutAccounts() {
  return useQuery({
    queryKey: ["settings", "payout-accounts"],
    queryFn: () => getAuthedClient().getPayoutAccounts(),
  });
}

// Step 1 of "add account" — confirm the account name before committing.
// A useMutation rather than useQuery on purpose: this fires once per
// explicit "look this up" tap, not automatically as someone types.
export function useLookupPayoutAccount() {
  return useMutation({
    mutationFn: (req: { bankCode: string; accountNumber: string }) =>
      getAuthedClient().lookupPayoutAccount(req),
  });
}

// Step 2 — the actual commit. Needs `pin` re-verified by the user at
// this exact step; see file header re: 401 handling.
export function useCreatePayoutAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: {
      bankCode: string;
      accountNumber: string;
      pin: string;
    }) => getAuthedClient().createPayoutAccount(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "payout-accounts"] });
    },
  });
}

export function useSetPrimaryPayoutAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => getAuthedClient().setPrimaryPayoutAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "payout-accounts"] });
    },
  });
}

export function useDeletePayoutAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, pin }: { id: string; pin: string }) =>
      getAuthedClient().deletePayoutAccount(id, { pin }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "payout-accounts"] });
    },
  });
}