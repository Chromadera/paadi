"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResetPassword } from "@/features/auth/login-hooks";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const resetMutation = useResetPassword();
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isPending = resetMutation.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!identifier.trim() || !code.trim() || !newPassword.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (code.length !== 6) {
      setErrorMsg("Verification code must be exactly 6 digits.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    resetMutation.mutate(
      { identifier, code, newPassword },
      {
        onSuccess: () => {
          setSuccessMsg("Password reset successful! You can now log in.");
          setTimeout(() => {
            router.push("/login");
          }, 2500);
        },
        onError: (err: any) => {
          setErrorMsg(err.message ?? "Invalid reset parameters. Please check your code and try again.");
        },
      }
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-linear-to-br from-bg via-bg to-secondary/10 px-6 pb-8 pt-5 justify-between max-w-sm mx-auto overflow-y-auto">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between w-full relative shrink-0">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xl font-bold p-2 text-ink/70 hover:text-ink transition-colors z-30"
        >
          ←
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xl font-black tracking-tight text-ink">Paadi</span>
        </div>
        <div className="w-10" />
      </div>

      {/* CORE FORM AREA */}
      <div className="flex-1 flex flex-col justify-center w-full my-auto max-y-[450px]">
        {/* Header Messaging */}
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-black tracking-tight text-ink leading-tight">
            Reset password
          </h1>
          <p className="mt-2 text-xs font-semibold text-ink/40">
            Enter the 6-digit code we sent you to set a new password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {errorMsg && (
            <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 text-xs font-bold text-danger text-center">
              ❌ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-xs font-bold text-success text-center">
              ✅ {successMsg}
              <p className="mt-1 text-[10px] text-success/70 font-medium">Redirecting you to login...</p>
            </div>
          )}

          {/* Identifier Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-ink/40 px-1">
              Phone, Username or Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={isPending || !!successMsg}
              placeholder="e.g. @tunde or +234..."
              className="w-full bg-white border-2 border-ink rounded-xl px-4 py-3.5 text-sm font-semibold text-ink placeholder:text-ink/30 focus:outline-hidden focus:border-primary shadow-[2px_2px_0px_0px_#111827] disabled:opacity-50 transition-all"
            />
          </div>

          {/* Code Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-ink/40 px-1">
              Recovery Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={isPending || !!successMsg}
              placeholder="000000"
              className="w-full bg-white border-2 border-ink rounded-xl px-4 py-3.5 text-sm font-semibold text-ink placeholder:text-ink/30 text-center tracking-widest focus:outline-hidden focus:border-primary shadow-[2px_2px_0px_0px_#111827] disabled:opacity-50 transition-all"
            />
          </div>

          {/* New Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-ink/40 px-1">
              New Password (min. 8 characters)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isPending || !!successMsg}
              placeholder="••••••••"
              className="w-full bg-white border-2 border-ink rounded-xl px-4 py-3.5 text-sm font-semibold text-ink placeholder:text-ink/30 focus:outline-hidden focus:border-primary shadow-[2px_2px_0px_0px_#111827] disabled:opacity-50 transition-all"
            />
          </div>

          {/* Reset Password CTA */}
          <button
            type="submit"
            disabled={isPending || !!successMsg}
            className="w-full rounded-2xl bg-primary py-4 px-4 font-bold text-ink text-base flex items-center justify-center gap-2 border-2 border-ink shadow-[0_4px_0px_0px_#111827] active:translate-y-[2px] active:shadow-[0_2px_0px_0px_#111827] disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[0_4px_0px_0px_#111827] transition-all select-none mt-4"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <span>Reset Password</span>
                <span className="text-lg">➔</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="w-full mt-auto pt-4 shrink-0 text-center">
        <p className="text-xs font-semibold text-ink/40">
          Remember password?{" "}
          <button
            onClick={() => router.push("/login")}
            className="font-bold text-amber-500 hover:text-primary transition-colors"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
