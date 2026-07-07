import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthedClient } from "@/lib/api/client";

export function useBanks() {
  return useQuery({
    queryKey: ["settings", "banks"],
    queryFn: () => getAuthedClient().getBanks(),
    staleTime: Infinity,
  });
}

export function usePayoutAccounts() {
  return useQuery({
    queryKey: ["settings", "payout-accounts"],
    queryFn: () => getAuthedClient().getPayoutAccounts(),
  });
}

export function useLookupPayoutAccount() {
  return useMutation({
    mutationFn: (req: { bankCode: string; accountNumber: string }) =>
      getAuthedClient().lookupPayoutAccount(req),
  });
}

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
