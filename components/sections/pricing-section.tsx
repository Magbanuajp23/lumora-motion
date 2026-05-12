import { Check, Coins, Sparkles } from "lucide-react";
import { pricingPlans } from "@/lib/lumora-motion-data";
import { SectionHeader } from "@/components/ui/section-header";

export function PricingSection({
  billing,
  onBilling
}: {
  billing: "monthly" | "yearly";
  onBilling: (value: "monthly" | "yearly") => void;
}) {
  return (
    <section id="pricing" className="relative overflow-x-hidden px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Pricing" title="Hybrid plans with monthly AI credits" copy="Choose a subscription, spend credits on edits, captions, beat sync, VFX, and premium exports." />
      <div className="mx-auto mb-8 flex w-fit rounded-xl border border-white/10 bg-white/[0.04] p-1">
        {(["monthly", "yearly"] as const).map((item) => (
          <button key={item} onClick={() => onBilling(item)} className={`rounded-lg px-4 py-2 text-sm font-bold capitalize transition ${billing === item ? "bg-white text-[#05070d]" : "text-slate-300 hover:text-white"}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="mx-auto grid w-full max-w-7xl min-w-0 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
        {pricingPlans.map((plan) => (
          <div key={plan.name} className={`relative rounded-3xl border p-6 transition duration-300 hover:-translate-y-2 hover:shadow-glow ${
            plan.featured
              ? "border-plasma/70 bg-plasma/[0.08] shadow-[0_0_70px_rgba(32,217,255,.2)] xl:scale-[1.02]"
              : "border-white/10 bg-white/[0.045] backdrop-blur-2xl"
          }`}>
            {plan.featured ? (
              <div className="absolute -top-4 left-1/2 max-w-[calc(100%-2rem)] -translate-x-1/2 whitespace-nowrap rounded-full border border-plasma/45 bg-[#06101a] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-plasma shadow-glow sm:text-xs sm:tracking-[0.22em]">
                {plan.tag}
              </div>
            ) : null}
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 break-words font-[var(--font-space)] text-2xl font-black text-white">{plan.name}</h3>
              {!plan.featured ? (
                <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">{plan.tag}</span>
              ) : null}
            </div>
            <div className="mt-6 font-[var(--font-space)] text-4xl font-black text-white sm:text-5xl">
              {billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
              {plan.monthlyPrice !== "$0" ? <span className="text-base text-slate-500">/mo</span> : null}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-plasma/20 bg-plasma/[0.08] px-4 py-3 text-sm font-bold text-plasma">
              <Coins className="h-4 w-4" aria-hidden="true" />
              {plan.credits}
            </div>
            {"watermark" in plan && plan.watermark ? (
              <div className="mt-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs text-slate-400">
                Watermark: {plan.watermark}
              </div>
            ) : null}
            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="h-4 w-4 text-signal" aria-hidden="true" />
                  {feature}
                </div>
              ))}
            </div>
            <button className={`mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-black transition hover:-translate-y-0.5 ${plan.featured ? "bg-white text-[#05070d] shadow-[0_0_35px_rgba(255,255,255,.18)]" : "border border-white/10 bg-white/[0.04] text-white hover:border-plasma/35 hover:bg-plasma/10"}`}>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
