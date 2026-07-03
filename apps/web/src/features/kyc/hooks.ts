import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthedClient } from "@/lib/api/client";

export function useKycStatus() {
  return useQuery({
    queryKey: ["me", "kyc"],
    queryFn: () => getAuthedClient().getKyc(),
  });
}

export function useSubmitBvn() {
  return useMutation({
    mutationFn: (bvn: string) => getAuthedClient().submitKycBvn({ bvn }),
  });
}

export function useSubmitSelfie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (image: string) => getAuthedClient().submitKycSelfie({ image }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["me", "kyc"] });
    },
  });
}
