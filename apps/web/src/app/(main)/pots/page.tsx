"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePots } from "@/features/pots/hooks";
import { Loader2, Plus, Calendar, Users, Landmark, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function PotsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isPending, error } = usePots({
    status: statusFilter === "all" ? undefined : statusFilter,
    limit: 20
  });

  const filterTabs = [
    { id: "all", label: "All" },
    { id: "open", label: "Open" },
    { id: "settled", label: "Settled" },
    { id: "cancelled", label: "Cancelled" }
  ];

  return (
    <div className="w-full flex flex-col pb-24">
      {/* HEADER BAR */}
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-ink tracking-tight">My Pots</h1>
          <p className="text-xs font-semibold text-ink/40 mt-0.5">Track your group split targets</p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/pots/create")}
          className="h-11 w-11 rounded-xl bg-primary border-2 border-ink shadow-[2px_2px_0px_0px_#111827] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#111827] flex items-center justify-center transition-all shrink-0"
        >
          <Plus className="h-5 w-5 text-ink stroke-[3]" />
        </button>
      </div>

      {/* SEGMENTED CONTROL TABS (Full width, balanced mobile grid) */}
      <div className="mt-5 bg-slate-100/80 p-1 rounded-2xl grid grid-cols-4 gap-1 border border-slate-200/40 select-none">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`py-2 rounded-xl text-xs font-black tracking-tight text-center transition-all duration-150 ${
              statusFilter === tab.id
                ? "bg-white text-ink shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200/50"
                : "text-ink/40 active:text-ink/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* POTS LIST */}
      <div className="mt-5 flex flex-col gap-4">
        {isPending && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <Loader2 className="h-6 w-6 text-secondary animate-spin stroke-[2.5]" />
            <span className="text-xs font-bold text-ink/40 tracking-wider uppercase">Fetching Active Pots...</span>
          </div>
        )}

        {error && !isPending && (
          <div className="rounded-2xl border-2 border-danger/20 bg-danger/5 p-5 text-center">
            <p className="text-xs font-bold text-danger">❌ Failed to retrieve pots list. Pull down to retry.</p>
          </div>
        )}

        {data && data.items.length === 0 && !isPending && (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-sm">
              🍯
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-black text-ink">No pots active</h3>
              <p className="text-xs font-semibold text-ink/40 mt-1 max-w-[200px] leading-relaxed mx-auto">
                Launch a group split pot to track contributions dynamically.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/pots/create")}
              className="mt-2 px-5 py-3 bg-primary border-2 border-ink shadow-[3px_3px_0px_0px_#111827] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#111827] rounded-xl text-xs font-black text-ink transition-all"
            >
              Create first pot
            </button>
          </div>
        )}

        {data && data.items.length > 0 && !isPending && (
          <div className="flex flex-col gap-4">
            {data.items.map((pot) => {
              const progressPct = pot.totalKobo > 0 ? Math.min(100, Math.round((pot.collectedKobo / pot.totalKobo) * 100)) : 0;
              const deadline = pot.deadlineAt ? new Date(pot.deadlineAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : null;

              return (
                <Link
                  key={pot.id}
                  href={`/pots/${pot.id}`}
                  className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.01)] hover:border-slate-200/80 active:scale-[0.99] transition-all flex flex-col gap-4 relative group"
                >
                  {/* Title & Status Block */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex flex-col text-left min-w-0">
                      <h3 className="font-black text-ink text-base tracking-tight group-hover:text-secondary transition-colors truncate pr-2">
                        {pot.title}
                      </h3>
                      {deadline && (
                        <span className="text-[10px] font-bold text-ink/40 mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3 stroke-[2.5]" /> Ends {deadline}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                        pot.status === "open"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : pot.status === "settled"
                          ? "bg-primary/20 text-amber-900 border-primary/30"
                          : "bg-slate-50 text-ink/40 border-slate-200"
                      }`}>
                        {pot.status}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-ink/20 group-hover:text-ink/40 transition-colors" />
                    </div>
                  </div>

                  {/* Financial Metrics Row */}
                  <div className="flex items-end justify-between border-t border-slate-50 pt-3.5 mt-0.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-ink/30 uppercase tracking-wide">Collected</span>
                      <span className="text-base font-black text-ink tracking-tight">
                        ₦{(pot.collectedKobo / 100).toLocaleString()}
                        <span className="text-xs font-bold text-ink/40 font-mono"> / ₦{(pot.totalKobo / 100).toLocaleString()}</span>
                      </span>
                    </div>

                    <div className="text-right flex flex-col items-end gap-0.5">
                      <span className="text-[10px] font-black text-ink/30 uppercase tracking-wide">Target Meta</span>
                      <span className="text-xs font-black text-secondary font-mono bg-secondary/5 px-2 py-0.5 rounded-md border border-secondary/10">
                        {progressPct}%
                      </span>
                    </div>
                  </div>

                  {/* High-Fidelity Progress Meter Layer */}
                  <div className="flex flex-col gap-2">
                    <div className="w-full h-3 bg-slate-50 border border-slate-100 rounded-full overflow-hidden relative shadow-inner">
                      <div
                        className="h-full bg-primary border-r border-ink/10 transition-all duration-500 rounded-full shadow-[inset_-2px_0px_4px_rgba(0,0,0,0.05)]"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] font-bold text-ink/40 px-0.5">
                      <span className="flex items-center gap-1 font-semibold">
                        <Users className="h-3.5 w-3.5 text-ink/30 stroke-[2]" />
                        {pot.paidCount} of {pot.splitCount} paid
                      </span>
                      {pot.status === "open" && (
                        <span className="text-green-600 font-bold flex items-center gap-0.5">
                          ● Active Collective
                        </span>
                      )}
                    </div>
                  </div>

                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}