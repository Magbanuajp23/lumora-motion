import Image from "next/image";
import { Play, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { demoCategories } from "@/lib/lumora-motion-data";

export function DemoSection() {
  return (
    <section id="demo" className="relative overflow-hidden border-y border-white/10 bg-[#03050a]/90 px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-aurora/10 blur-3xl" />
      <SectionHeader
        eyebrow="Before / after"
        title="Raw footage becomes a viral cinematic short"
        copy="Preview the creator workflow Lumora Motion is built around: rough clips in, retention-optimized short-form edits out."
      />
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="glass-panel overflow-hidden rounded-3xl">
          <div className="grid min-w-0 md:grid-cols-2">
            <PreviewPane label="Raw clip" tone="Before" muted />
            <PreviewPane label="Edited cinematic output" tone="After" />
          </div>
          <div className="border-t border-white/10 bg-black/35 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Comparison slider</p>
                <h3 className="mt-1 font-[var(--font-space)] text-2xl font-black text-white">Hook, captions, pacing, grade</h3>
              </div>
              <div className="rounded-full border border-signal/25 bg-signal/10 px-4 py-2 text-sm font-bold text-signal">
                Autoplay demo preview
              </div>
            </div>
            <div className="relative mt-5 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
              <Image src="/lumora-motion-hero.png" alt="Raw video before Lumora Motion edit" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover grayscale brightness-50 contrast-75" />
              <div className="absolute inset-y-0 left-0 w-[62%] overflow-hidden border-r border-white shadow-glow">
                <div className="relative h-full w-full">
                <Image src="/lumora-motion-hero.png" alt="Edited video after Lumora Motion edit" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover saturate-150 contrast-125" />
                </div>
              </div>
              <div className="absolute left-[62%] top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-white/15 backdrop-blur-xl" />
              <span className="absolute left-3 top-3 rounded-md bg-black/55 px-2 py-1 text-xs text-slate-300 backdrop-blur">Before</span>
              <span className="absolute right-3 top-3 rounded-md bg-plasma/15 px-2 py-1 text-xs text-plasma backdrop-blur">After</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {demoCategories.map((category) => (
            <div key={category.name} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-plasma/35 hover:shadow-glow">
              <div className={`relative aspect-[9/12] overflow-hidden rounded-2xl bg-gradient-to-br ${category.accent} p-px sm:aspect-[4/5] lg:aspect-[9/5]`}>
                <div className="relative h-full rounded-2xl bg-black/80">
                  <Image src="/lumora-motion-hero.png" alt={`${category.name} vertical short-form demo`} fill sizes="(min-width: 1024px) 32vw, 50vw" className="object-cover opacity-70 transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <button className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-xl transition duration-300 group-hover:scale-110" aria-label={`Preview ${category.name}`}>
                    <Play className="ml-0.5 h-5 w-5 fill-white" aria-hidden="true" />
                  </button>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-sm font-black uppercase tracking-[0.18em] text-white">{category.name}</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-black/55 px-2 py-1 text-slate-300">{category.raw}</span>
                      <span className="rounded-full bg-plasma/15 px-2 py-1 text-plasma">{category.edited}</span>
                      <span className="rounded-full bg-signal/15 px-2 py-1 text-signal">{category.stat}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PreviewPane({
  label,
  muted,
  tone
}: {
  label: string;
  muted?: boolean;
  tone: string;
}) {
  return (
    <div className="relative aspect-[4/5] min-w-0 overflow-hidden border-b border-white/10 md:border-b-0 md:border-r">
      <Image src="/lumora-motion-hero.png" alt={label} fill sizes="(min-width: 768px) 32vw, 100vw" className={`object-cover ${muted ? "grayscale brightness-50 contrast-75" : "saturate-150 contrast-125"}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300 backdrop-blur-xl">
        {tone}
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <div className="inline-flex items-center gap-2 rounded-xl border border-plasma/20 bg-plasma/10 px-3 py-2 text-sm font-bold text-white backdrop-blur-xl">
          <Sparkles className="h-4 w-4 text-plasma" aria-hidden="true" />
          {label}
        </div>
      </div>
    </div>
  );
}
