import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthedClient } from "@/lib/api/client";
import { CreatePotInput } from "@paadi/contracts";

export function useElectricityProviders() {
  return useQuery({
    queryKey: ["bills", "electricity-providers"],
    queryFn: () => getAuthedClient().listElectricityProviders(),
    staleTime: Infinity,
  });
}

export function useCableProviders() {
  return useQuery({
    queryKey: ["bills", "cable-providers"],
    queryFn: () => getAuthedClient().listCableProviders(),
    staleTime: Infinity,
  });
}

export function useCablePlans(cableTvType: string | undefined) {
  return useQuery({
    queryKey: ["bills", "cable-plans", cableTvType],
    queryFn: () => getAuthedClient().listCablePlans(cableTvType!),
    enabled: Boolean(cableTvType),
    staleTime: Infinity,
  });
}

export function useLookupElectricityCustomer() {
  return useMutation({
    mutationFn: (query: { disco: string; customerId: string; meterType: "PREPAID" | "POSTPAID" }) =>
      getAuthedClient().lookupElectricityCustomer(query),
  });
}

export function useLookupCableCustomer() {
  return useMutation({
    mutationFn: (query: { cableTvType: string; customerId: string }) =>
      getAuthedClient().lookupCableCustomer(query),
  });
}

export function useCreatePot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ input, idempotencyKey }: { input: CreatePotInput; idempotencyKey: string }) =>
      getAuthedClient().createPot(input, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pots"] });
    },
  });
}
