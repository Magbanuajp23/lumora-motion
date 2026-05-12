import { Blocks, Coins, Layers3 } from "lucide-react";
import { creditCosts, creditSummary } from "@/lib/lumora-motion-data";

export function DashboardSummary() {
  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Creator cockpit</p>
          <h2 className="mt-1 font-[var(--font-space)] text-2xl font-bold text-white">Credits and shot intelligence</h2>
        </div>
        <Layers3 className="h-6 w-6 text-aurora" aria-hidden="true" />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[["Faces", "locked"], ["B-roll", "12 clips"], ["Captions", "auto style"]].map(([title, value]) => (
          <div key={title} className="rounded-xl border border-white/10 bg-black/20 p-4">
            <Blocks className="h-5 w-5 text-plasma" aria-hidden="true" />
            <div className="mt-4 text-sm text-slate-400">{title}</div>
            <div className="mt-1 font-[var(--font-space)] text-xl font-bold text-white">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-plasma/20 bg-plasma/[0.07] p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-plasma">
            <Coins className="h-4 w-4" aria-hidden="true" />
            Remaining credits
          </span>
          <span className="font-[var(--font-space)] text-2xl font-black text-white">{creditSummary.remainingCredits}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-plasma to-signal animate-bar-shimmer" style={{ width: `${Math.round((creditSummary.remainingCredits / creditSummary.monthlyCredits) * 100)}%` }} />
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {creditCosts.slice(0, 4).map(([label, cost]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-400">
            <span className="text-white">{label}</span> · {cost}
          </div>
        ))}
      </div>
    </div>
  );
}
