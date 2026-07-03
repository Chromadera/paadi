"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  usePot,
  useCancelPot,
  useDeletePot,
  usePotSettlement,
  usePotActivity
} from "@/features/pots/hooks";
import {
  Loader2,
  Calendar,
  Share2,
  CheckCircle,
  Copy,
  AlertTriangle,
  Receipt,
  FileText,
  Clock,
  ArrowUpRight
} from "lucide-react";

export default function PotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: pot, isPending, error } = usePot(id);
  const { data: settlement } = usePotSettlement(id);
  const { data: activity } = usePotActivity(id);

  const cancelPotMutation = useCancelPot(id);
  const deletePotMutation = useDeletePot(id);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const isMutating = cancelPotMutation.isPending || deletePotMutation.isPending;

  function handleCopyLink(token: string, index: number) {
    if (typeof window === "undefined") return;
    const payLink = `${window.location.origin}/pay/${token}`;
    navigator.clipboard.writeText(payLink);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  function handleCancel() {
    if (!window.confirm("Are you sure you want to cancel this pot? This will stop collections.")) return;
    cancelPotMutation.mutate(undefined, {
      onError: (err: any) => setErrorMsg(err.message ?? "Failed to cancel pot.")
    });
  }

  function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this pot permanently?")) return;
    deletePotMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/pots");
      },
      onError: (err: any) => setErrorMsg(err.message ?? "Failed to delete pot.")
    });
  }

  if (isPending) {
    return (
      <div className="flex h-dvh items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <span className="text-xs font-bold text-ink/40 tracking-wider uppercase">Loading Pot details...</span>
        </div>
      </div>
    );
  }

  if (error || !pot) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center bg-bg text-center px-6">
        <p className="text-sm font-bold text-danger">❌ Pot not found or access denied.</p>
        <button
          onClick={() => router.push("/pots")}
          className="mt-4 px-4 py-2 bg-primary border-2 border-ink rounded-xl text-xs font-black"
        >
          Back to Pots
        </button>
      </div>
    );
  }

  const progressPct = pot.totalKobo > 0 ? Math.min(100, Math.round((pot.progress.collectedKobo / pot.totalKobo) * 100)) : 0;
  const deadline = pot.deadlineAt ? new Date(pot.deadlineAt).toLocaleDateString() : null;

  return (
    <div className="w-full flex flex-col pb-8">
      {/* HEADER NAVIGATION */}
      <div className="flex items-center justify-between w-full shrink-0">
        <button
          type="button"
          onClick={() => router.push("/pots")}
          className="text-xl font-bold p-2 text-ink/75 hover:text-ink transition-colors"
        >
          ←
        </button>
        <h1 className="text-sm font-extrabold tracking-tight text-ink uppercase">Pot Overview</h1>
        <div className="w-10" />
      </div>

      {errorMsg && (
        <div className="mt-4 bg-danger/10 border border-danger/20 rounded-xl p-3 text-xs font-bold text-danger text-center">
          ❌ {errorMsg}
        </div>
      )}

      {/* CORE DETAIL CONTAINER */}
      <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col text-left">
            <h2 className="text-base font-black text-ink leading-tight">{pot.title}</h2>
            {deadline && (
              <span className="text-[10px] font-semibold text-ink/40 mt-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Ends {deadline}
              </span>
            )}
          </div>
          <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase border ${
            pot.status === "open"
              ? "bg-green-50 text-green-700 border-green-200"
              : pot.status === "settled"
              ? "bg-primary/10 text-amber-800 border-primary/20"
              : "bg-slate-50 text-ink/40 border-slate-200"
          }`}>
            {pot.status}
          </span>
        </div>

        {pot.description && (
          <p className="text-xs font-medium text-ink/60 leading-relaxed text-left">
            {pot.description}
          </p>
        )}

        <div className="w-full h-[1px] bg-slate-100" />

        {/* PROGRESS METRICS */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[11px] font-extrabold">
            <span className="text-ink/40">Collection Progress ({pot.progress.paidCount}/{pot.progress.splitCount} paid)</span>
            <span className="text-ink">
              ₦{(pot.progress.collectedKobo / 100).toLocaleString()} / ₦{(pot.totalKobo / 100).toLocaleString()}
            </span>
          </div>

          <div className="w-full h-3 bg-slate-50 border border-slate-100 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* SETTLEMENT STATUS PANEL */}
      {settlement?.settlement && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left">
          <div className="flex items-center gap-2 text-amber-800 mb-2">
            <Receipt className="h-4.5 w-4.5 stroke-[2.25]" />
            <span className="text-xs font-black uppercase tracking-wider">Settlement status</span>
          </div>

          <div className="flex flex-col gap-1 text-xs text-amber-900/80 font-semibold">
            <p>Status: <span className="font-extrabold capitalize">{settlement.settlement.status}</span></p>
            {settlement.settlement.vend && (
              <div className="mt-1 bg-white/50 p-2.5 rounded-lg border border-amber-200/50 flex flex-col gap-0.5">
                <p className="text-[10px] uppercase text-amber-800 tracking-wider">Electricity Token</p>
                <p className="font-black text-sm text-ink select-all mt-0.5">{settlement.settlement.vend.token || "Generating..."}</p>
                <p className="text-[10px] text-ink/40 mt-0.5">{settlement.settlement.vend.units || "0"} units vended</p>
              </div>
            )}
            {settlement.settlement.destination && (
              <p>Destination: <span className="font-extrabold">{settlement.settlement.destination.bankName} (*{settlement.settlement.destination.accountNumberLast4})</span></p>
            )}
          </div>
        </div>
      )}

      {/* SPLITS LIST */}
      <div className="mt-4 flex flex-col gap-2.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink/40 px-1 text-left">
          Split Links for Contributors
        </span>

        <div className="flex flex-col gap-2">
          {pot.splits.map((split, i) => (
            <div
              key={split.id}
              className="bg-white border border-slate-100 rounded-xl p-3 flex justify-between items-center shadow-xs"
            >
              <div className="flex flex-col text-left">
                <span className="text-xs font-extrabold text-ink">{split.label}</span>
                <span className="text-[10px] font-bold text-ink/40 mt-0.5">
                  ₦{(split.shareKobo / 100).toLocaleString()} · <span className="capitalize">{split.status}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${
                  split.status === "paid"
                    ? "bg-green-50 text-green-700"
                    : "bg-slate-50 text-ink/40"
                }`}>
                  {split.status}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopyLink(split.payToken, i)}
                  className={`p-2 rounded-lg border flex items-center justify-center transition-all ${
                    copiedIndex === i
                      ? "bg-success/15 border-success text-success"
                      : "bg-slate-50 border-slate-100 text-ink/50 hover:bg-slate-100"
                  }`}
                >
                  {copiedIndex === i ? (
                    <CheckCircle className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIVITY FEED SUB-LIST */}
      {activity?.items && activity.items.length > 0 && (
        <div className="mt-5 flex flex-col gap-2.5 text-left">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink/40 px-1">
            Recent activity
          </span>
          <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
            {activity.items.slice(0, 3).map((act) => (
              <div key={act.id} className="flex gap-2.5 items-start text-xs">
                <div className="h-5 w-5 rounded-full bg-slate-50 flex items-center justify-center text-[10px] text-ink/40 shrink-0">
                  ⚡
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-ink">{act.headline}</span>
                  <span className="text-[10px] text-ink/40 mt-0.5">{new Date(act.occurredAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POT MANAGEMENT ACTIONS */}
      <div className="mt-6 flex flex-col gap-2.5 w-full">
        {pot.status === "open" && pot.progress.collectedKobo === 0 && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isMutating}
            className="w-full py-3.5 bg-danger/10 border-2 border-danger/20 hover:border-danger/40 text-danger rounded-xl text-xs font-black transition-all text-center flex items-center justify-center gap-1.5"
          >
            Delete Pot Permanently
          </button>
        )}

        {pot.status === "open" && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isMutating}
            className="w-full py-3.5 bg-white border-2 border-ink hover:bg-slate-50 text-ink rounded-xl text-xs font-black transition-all text-center shadow-xs"
          >
            Cancel Pot (Stop collections)
          </button>
        )}
      </div>
    </div>
  );
}
