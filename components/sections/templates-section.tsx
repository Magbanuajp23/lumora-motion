import { ArrowRight, BadgeCheck, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { templates } from "@/lib/lumora-motion-data";

export function TemplatesSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Templates"
        title="One-click viral editing systems"
        copy="Start from cinematic creator templates designed for retention, captions, beat sync, and platform-native pacing."
      />
      <div className="mx-auto grid w-full max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {templates.map(([name, preview, credits, tags, badge], index) => (
          <article key={name} className="group relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-plasma/40 hover:shadow-glow">
            <div className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-bold text-plasma backdrop-blur-xl">
              {badge}
            </div>
            <div className={`relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br ${index % 3 === 0 ? "from-signal via-plasma to-white" : index % 3 === 1 ? "from-plasma via-aurora to-white" : "from-aurora via-white to-signal"} p-px`}>
              <div className="relative h-full rounded-2xl bg-[#070b12] p-4">
                <div className="scanline absolute inset-0 rounded-2xl opacity-60" />
                <div className="absolute inset-x-6 top-8 h-px animate-scan bg-gradient-to-r from-transparent via-white to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white/10 shadow-glow">
                      <Sparkles className="h-5 w-5 text-plasma" aria-hidden="true" />
                    </div>
                    <div className="mt-5 text-sm uppercase tracking-[0.18em] text-slate-400">{preview}</div>
                    <h3 className="mt-2 font-[var(--font-space)] text-2xl font-black text-white">{name}</h3>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-xs text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl border border-plasma/20 bg-plasma/10 px-3 py-2 text-sm font-bold text-plasma">
                      {credits}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-black text-[#05070d] transition duration-300 hover:-translate-y-0.5 hover:bg-slate-200">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              Quick apply
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
