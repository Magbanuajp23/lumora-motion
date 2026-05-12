import Image from "next/image";
import { Play, Radio, Sparkles, Wand2 } from "lucide-react";
import { brand } from "@/lib/lumora-motion-data";

export function HeroSection({ selectedPreset }: { selectedPreset: string }) {
  return (
    <section id="home" className="relative mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
      <div className="max-w-2xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-plasma/30 bg-plasma/10 px-3 py-2 text-sm text-plasma shadow-glow backdrop-blur-xl">
          <Wand2 className="h-4 w-4" aria-hidden="true" />
          AI edit command center
        </div>
        <h1 className="font-[var(--font-space)] text-5xl font-black leading-[0.96] tracking-normal text-white sm:text-6xl lg:text-8xl">
          Turn Raw Clips Into
          <span className="block bg-gradient-to-r from-plasma via-white to-aurora bg-clip-text text-transparent">
            Viral Cinematic Edits Instantly
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
          AI-powered video editing for creators, gamers, businesses, and viral short-form content.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#studio" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-bold text-[#05070d] shadow-[0_0_40px_rgba(255,255,255,.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-slate-200">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Start Creating
          </a>
          <a href="#results" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] px-5 text-sm font-semibold text-white backdrop-blur-xl transition duration-300 hover:border-plasma/40 hover:bg-plasma/10">
            <Play className="h-4 w-4" aria-hidden="true" />
            Watch Demo
          </a>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[["38K", "videos rendered"], ["4.9x", "faster workflow"], ["94%", "viral score"]].map(([value, label]) => (
            <div key={label} className="glass-card rounded-xl px-4 py-4 transition duration-300 hover:-translate-y-1 hover:border-plasma/35 hover:shadow-glow">
              <div className="font-[var(--font-space)] text-3xl font-black text-white">{value}</div>
              <div className="mt-1 text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-plasma/25 via-transparent to-aurora/25 blur-3xl" />
        <div className="preview-frame relative overflow-hidden rounded-3xl border border-white/15 bg-[#08101b]/80 shadow-2xl shadow-black/60 backdrop-blur-2xl">
          <div className="relative aspect-[16/10] min-h-[310px]">
            <Image src="/lumora-motion-hero.png" alt="Futuristic Lumora Motion editing interface" fill priority sizes="(min-width: 1024px) 54vw, 100vw" className="object-cover opacity-85 transition duration-700 hover:scale-[1.03]" />
            <div className="scanline absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/20 to-transparent" />
            <div className="absolute inset-x-8 top-8 h-px animate-scan bg-gradient-to-r from-transparent via-plasma to-transparent" />
            <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/45 px-3 py-2 text-sm text-slate-200 shadow-glow backdrop-blur-xl">Preview 01</div>
            <div className="absolute right-4 top-4 rounded-lg border border-signal/25 bg-signal/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-signal backdrop-blur-xl">AI online</div>
            <button className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/15 text-white shadow-glow backdrop-blur-md transition duration-300 hover:scale-110" aria-label="Play preview">
              <span className="absolute inset-0 rounded-full border border-plasma/40 animate-ping" />
              <Play className="relative ml-1 h-8 w-8 fill-white" aria-hidden="true" />
            </button>
          </div>
          <div className="border-t border-white/10 bg-[#060a12]/90 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Demo video preview</p>
                <h2 className="mt-1 font-[var(--font-space)] text-2xl font-bold text-white">
                  {selectedPreset} render pass
                </h2>
              </div>
              <Radio className="h-5 w-5 animate-pulse text-signal" aria-hidden="true" />
            </div>
            <div className="mt-5 space-y-3">
              {["Scene", "Grade", "Audio"].map((row, index) => (
                <div key={row} className="grid grid-cols-[4.5rem_1fr] items-center gap-3 text-sm">
                  <span className="text-slate-400">{row}</span>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full bg-gradient-to-r ${index === 1 ? "w-[58%] from-aurora to-plasma" : index === 2 ? "w-[86%] from-signal to-plasma" : "w-[76%] from-plasma to-white"} animate-bar-shimmer`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-plasma/20 bg-plasma/[0.06] px-4 py-3 text-xs uppercase tracking-[0.22em] text-plasma">
              {brand.watermark}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
