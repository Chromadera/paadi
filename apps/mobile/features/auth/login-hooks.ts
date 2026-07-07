import { useMutation } from "@tanstack/react-query";
import { publicClient } from "@/lib/api/client";
import { useSessionStore } from "@/lib/auth/session";
import type {
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@paadi/contracts";

export function useLogin() {
  const setSession = useSessionStore((s) => s.setSession);

  return useMutation({
    mutationFn: (input: LoginInput) => publicClient.login(input),
    onSuccess: (data) => {
      setSession(data);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) =>
      publicClient.forgotPassword(input),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) =>
      publicClient.resetPassword(input),
  });
}
