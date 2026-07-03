import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthedClient } from "@/lib/api/client";
import { UpdatePotInput } from "@paadi/contracts";

export function usePots(query?: { cursor?: string; limit?: number; status?: string }) {
  return useQuery({
    queryKey: ["pots", query],
    queryFn: () => getAuthedClient().listPots(query),
  });
}

export function usePot(id: string) {
  return useQuery({
    queryKey: ["pot", id],
    queryFn: () => getAuthedClient().getPot(id),
    enabled: Boolean(id),
  });
}

export function useUpdatePot(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdatePotInput) => getAuthedClient().updatePot(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pot", id] });
      queryClient.invalidateQueries({ queryKey: ["pots"] });
    },
  });
}

export function useDeletePot(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => getAuthedClient().deletePot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pots"] });
    },
  });
}

export function useCancelPot(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => getAuthedClient().cancelPot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pot", id] });
      queryClient.invalidateQueries({ queryKey: ["pots"] });
    },
  });
}

export function usePotSettlement(id: string) {
  return useQuery({
    queryKey: ["pot", id, "settlement"],
    queryFn: () => getAuthedClient().getPotSettlement(id),
    enabled: Boolean(id),
  });
}

export function usePotActivity(id: string) {
  return useQuery({
    queryKey: ["pot", id, "activity"],
    queryFn: () => getAuthedClient().getPotActivity(id),
    enabled: Boolean(id),
  });
}
