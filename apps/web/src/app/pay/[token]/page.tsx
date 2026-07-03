"use client";

import { use, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicClient } from "@/lib/api/client";
import { Loader2, Landmark, ShieldCheck, CreditCard, ExternalLink } from "lucide-react";

export default function PayPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);

  // Poll every 3.5 seconds if the split status is not paid yet
  const { data: view, isPending, error } = useQuery({
    queryKey: ["pay", token],
    queryFn: () => publicClient.getPayerView(token),
    refetchInterval: (query) => {
      const currentView = query.state.data;
      if (currentView && (currentView.shareStatus === "pending" || currentView.shareStatus === "partially_paid")) {
        return 3500; // poll to wait for Nomba checkout webhook completion
      }
      return false;
    },
  });

  if (isPending) {
    return (
      <div className="flex h-dvh items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <span className="text-xs font-bold text-ink/40 tracking-wider uppercase">Loading Payment Link...</span>
        </div>
      </div>
    );
  }

  if (error || !view) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center bg-bg text-center px-6">
        <p className="text-sm font-bold text-danger">❌ Payment link not found or expired.</p>
        <p className="text-xs text-ink/40 mt-1 max-w-[240px]">Contact the pot organizer to check if this split link is still valid.</p>
      </div>
    );
  }

  const isPaid = view.shareStatus === "paid" || view.shareStatus === "overpaid";
  const overallProgressPct = view.progress.targetKobo > 0 ? Math.min(100, Math.round((view.progress.collectedKobo / view.progress.targetKobo) * 100)) : 0;

  return (
    <div className="flex h-dvh flex-col bg-linear-to-br from-bg via-bg to-secondary/10 px-6 pb-8 pt-5 justify-between max-w-sm mx-auto overflow-y-auto">
      {/* BRANDING HEADER */}
      <div className="flex items-center justify-center w-full shrink-0 py-2 border-b border-slate-100 bg-white/40 backdrop-blur-md rounded-2xl">
        <span className="text-xl font-black tracking-tight text-ink">Paadi</span>
      </div>

      {/* CORE PAYMENT DETAIL AREA */}
      <div className="flex-1 flex flex-col justify-center w-full my-auto max-y-[450px]">
        {/* Pot Title Messaging */}
        <div className="text-center mb-6">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-ink/30">Contribution Split</span>
          <h1 className="text-xl font-black tracking-tight text-ink leading-tight mt-1">
            {view.potTitle}
          </h1>
        </div>

        {/* Organizer details card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center gap-3.5 mb-4 text-left">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary border border-ink text-sm font-black text-ink shadow-xs">
            {view.organizerName[0].toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">Organizer</span>
            <span className="font-extrabold text-ink leading-tight text-sm mt-0.5">{view.organizerName}</span>
            <span className="text-xs font-semibold text-ink/30 mt-0.5">@{view.organizerHandle}</span>
          </div>
        </div>

        {/* Payment Amount Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col gap-4 text-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-extrabold text-ink/40 tracking-wider uppercase">Your Split Share ({view.splitLabel})</span>
            <span className="text-2xl font-black text-ink tracking-tight mt-1">
              ₦{(view.shareKobo / 100).toLocaleString()}
            </span>
          </div>

          <div className="w-full h-[1px] bg-slate-100" />

          {/* Overall pot progress details */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-bold text-ink/40">
              <span>Overall pot progress</span>
              <span className="text-ink">
                ₦{(view.progress.collectedKobo / 100).toLocaleString()} / ₦{(view.progress.targetKobo / 100).toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${overallProgressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER CALL TO ACTION */}
      <div className="w-full mt-auto pt-4 shrink-0">
        {isPaid ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex flex-col items-center gap-2.5 text-green-900 text-center animate-fade-in">
            <div className="h-10 w-10 rounded-full bg-success/15 flex items-center justify-center text-success border border-success/10">
              <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold">Contribution Paid!</span>
              <p className="text-[10px] text-green-900/60 font-semibold mt-1">
                Thank you. The organizer has been notified of your payment.
              </p>
            </div>
          </div>
        ) : view.potStatus === "cancelled" ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center text-ink/50 text-xs font-bold">
            🚫 This split pot has been cancelled by the organizer.
          </div>
        ) : view.checkoutUrl ? (
          <a
            href={view.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-2xl bg-primary py-4 px-4 font-bold text-ink text-base flex items-center justify-center gap-2 border-2 border-ink shadow-[0_4px_0px_0px_#111827] active:translate-y-[2px] active:shadow-[0_2px_0px_0px_#111827] transition-all text-center select-none"
          >
            <CreditCard className="h-5 w-5 stroke-[2]" />
            <span>Pay with Nomba Checkout</span>
            <ExternalLink className="h-4 w-4 stroke-[2]" />
          </a>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center text-ink/50 text-xs font-bold">
            ⏳ Checkout session is not initialized. Try again.
          </div>
        )}
      </div>
    </div>
  );
}
