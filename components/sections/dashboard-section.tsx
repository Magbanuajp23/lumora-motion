import { ArrowUpRight, Coins, CreditCard, ListChecks, Sparkles, Zap } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { aiSuggestions, creditBundles, creditCosts, creditSummary, renderQueue, usageHistory } from "@/lib/lumora-motion-data";

export function DashboardSection() {
  return (
    <section id="dashboard" className="relative overflow-x-hidden border-y border-white/10 bg-[#03050a]/90 px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Dashboard" title="AI editing operating system" copy="Track renders, credits, suggestions, export status, and recent projects from one creator command center." />
      <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="glass-panel min-w-0 rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Current plan</p>
              <h3 className="mt-1 font-[var(--font-space)] text-3xl font-black text-white">{creditSummary.plan}</h3>
            </div>
            <CreditCard className="h-7 w-7 text-plasma" aria-hidden="true" />
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="flex justify-between text-sm text-slate-400">
              <span>AI credits remaining</span>
              <span>{creditSummary.remainingCredits} / {creditSummary.monthlyCredits}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-plasma to-signal animate-bar-shimmer" style={{ width: `${Math.round((creditSummary.remainingCredits / creditSummary.monthlyCredits) * 100)}%` }} />
            </div>
            <div className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">{creditSummary.renewal}</div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="text-sm text-slate-400">Used this cycle</div>
              <div className="mt-1 font-[var(--font-space)] text-3xl font-black text-white">{creditSummary.usedCredits}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="text-sm text-slate-400">Monthly allowance</div>
              <div className="mt-1 font-[var(--font-space)] text-3xl font-black text-white">{creditSummary.monthlyCredits}</div>
            </div>
          </div>
          <button className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-black text-[#05070d] transition hover:-translate-y-0.5">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            New Project
          </button>
          <button className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-plasma/35 bg-plasma/10 px-4 text-sm font-black text-plasma transition hover:-translate-y-0.5 hover:shadow-glow">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            Upgrade Plan
          </button>
        </div>
        <div className="glass-panel min-w-0 rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="break-words font-[var(--font-space)] text-2xl font-black text-white">User projects</h3>
            <span className="w-fit rounded-full bg-plasma/10 px-3 py-1 text-sm text-plasma">Recent video edits</span>
          </div>
          <div className="mt-5 grid gap-3">
            {[
              ["Product launch reel", "Viral TikTok", "94% viral score"],
              ["Oceanfront listing tour", "Real Estate", "32 scenes optimized"],
              ["Founder story cut", "Motivational", "24 captions added"]
            ].map(([title, style, stat]) => (
              <div key={title} className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className="font-bold text-white">{title}</div>
                  <div className="mt-1 text-sm text-slate-400">{style}</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">{stat}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Queue", "3 active"],
              ["Exports", "18 this week"],
              ["Avg viral score", "91%"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="text-sm text-slate-400">{label}</div>
                <div className="mt-1 font-[var(--font-space)] text-2xl font-black text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-6 grid w-full max-w-7xl min-w-0 gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="glass-panel min-w-0 rounded-3xl p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <ListChecks className="h-6 w-6 text-signal" aria-hidden="true" />
            <h3 className="font-[var(--font-space)] text-2xl font-black text-white">Render queue</h3>
          </div>
          <div className="mt-5 grid gap-3">
            {renderQueue.map(([project, status, progress]) => (
              <div key={project} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-white">{project}</div>
                    <div className="mt-1 text-sm text-slate-400">{status}</div>
                  </div>
                  <span className="rounded-lg border border-plasma/20 bg-plasma/10 px-3 py-2 text-sm font-bold text-plasma">{progress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel min-w-0 rounded-3xl p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-plasma" aria-hidden="true" />
            <h3 className="font-[var(--font-space)] text-2xl font-black text-white">AI suggestions</h3>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {aiSuggestions.map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition duration-300 hover:-translate-y-1 hover:border-plasma/35">
                <div className="font-bold text-white">{title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-6 grid w-full max-w-7xl min-w-0 gap-6 lg:grid-cols-3">
        <div className="glass-panel min-w-0 rounded-3xl p-5 sm:p-6 lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="break-words font-[var(--font-space)] text-2xl font-black text-white">Usage history</h3>
            <span className="w-fit rounded-full border border-plasma/25 bg-plasma/10 px-3 py-1 text-sm text-plasma">credit ledger</span>
          </div>
          <div className="mt-5 grid gap-3">
            {usageHistory.map(([project, action, credits, date]) => (
              <div key={`${project}-${date}`} className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                <div>
                  <div className="font-bold text-white">{project}</div>
                  <div className="mt-1 text-sm text-slate-400">{action}</div>
                </div>
                <div className="rounded-lg border border-aurora/20 bg-aurora/10 px-3 py-2 text-sm font-bold text-aurora">{credits}</div>
                <div className="text-sm text-slate-500 sm:text-right">{date}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel min-w-0 rounded-3xl p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Coins className="h-6 w-6 text-plasma" aria-hidden="true" />
            <h3 className="font-[var(--font-space)] text-2xl font-black text-white">Buy More Credits</h3>
          </div>
          <div className="mt-5 grid gap-3">
            {creditBundles.map(([name, credits, price]) => (
              <button key={name} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-plasma/40 hover:bg-plasma/10">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-white">{name}</span>
                  <span className="font-[var(--font-space)] text-xl font-black text-plasma">{price}</span>
                </div>
                <div className="mt-1 text-sm text-slate-400">{credits}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-6 grid w-full max-w-7xl min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {creditCosts.map(([label, cost]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl">
            <Zap className="h-5 w-5 text-signal" aria-hidden="true" />
            <div className="mt-3 font-bold text-white">{label}</div>
            <div className="mt-1 text-sm text-plasma">{cost}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
