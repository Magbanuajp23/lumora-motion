import Image from "next/image";
import { AudioWaveform, Clapperboard, Play, Radio, Sparkles, Zap } from "lucide-react";
import { brand, creatorStats } from "@/lib/lumora-motion-data";

export function HeroSection({ selectedPreset }: { selectedPreset: string }) {
  return (
    <section id="home" className="relative mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-7xl items-center gap-8 overflow-hidden px-4 py-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full bg-plasma/10 blur-3xl sm:h-[34rem] sm:w-[34rem]" />
      <div className="particle-field pointer-events-none absolute inset-0 opacity-70" />
      <div className="min-w-0 max-w-2xl">
        <h1 className="max-w-full font-[var(--font-space)] text-[2.15rem] font-black leading-[1.02] tracking-normal text-white min-[390px]:text-[2.35rem] sm:text-6xl sm:leading-[0.96] lg:text-8xl">
          <span className="block">Turn Raw Clips</span>
          <span className="block bg-gradient-to-r from-plasma via-white to-aurora bg-clip-text text-transparent">
            Into Viral
          </span>
          <span className="block bg-gradient-to-r from-plasma via-white to-aurora bg-clip-text text-transparent">
            Cinematic Edits
          </span>
          <span className="block bg-gradient-to-r from-plasma via-white to-aurora bg-clip-text text-transparent">
            Instantly
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-xl sm:leading-8">
          AI-powered editing for creators, gamers, businesses, and viral short-form content.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#studio" className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-black text-[#05070d] shadow-[0_0_48px_rgba(255,255,255,.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-slate-200 sm:h-12">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Start Editing
          </a>
          <a href="#transformations" className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-6 text-sm font-bold text-white backdrop-blur-xl transition duration-300 hover:border-plasma/40 hover:bg-plasma/10 hover:shadow-glow sm:h-12">
            <Play className="h-4 w-4" aria-hidden="true" />
            Watch Demo
          </a>
          <a href="#transformations" className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-plasma/25 bg-plasma/10 px-6 text-sm font-bold text-plasma backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-plasma/50 hover:bg-plasma/15 hover:shadow-glow sm:h-12">
            <Clapperboard className="h-4 w-4" aria-hidden="true" />
            See AI Transformation
          </a>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {creatorStats.map(([value, label]) => (
            <div key={label} className="glass-card rounded-xl px-4 py-4 transition duration-300 hover:-translate-y-1 hover:border-plasma/35 hover:shadow-glow">
              <div className="font-[var(--font-space)] text-3xl font-black text-white">{value}</div>
              <div className="mt-1 text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative min-w-0">
        <div className="float-card absolute -left-2 top-8 z-10 hidden rounded-2xl border border-white/10 bg-black/45 p-4 shadow-glow backdrop-blur-2xl lg:block">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-signal" aria-hidden="true" />
            <div>
              <div className="text-sm font-bold text-white">Hook detected</div>
              <div className="text-xs text-slate-400">0:00-0:02 retention spike</div>
            </div>
          </div>
        </div>
        <div className="float-card absolute -right-3 bottom-24 z-10 hidden rounded-2xl border border-plasma/20 bg-plasma/10 p-4 shadow-glow backdrop-blur-2xl lg:block [animation-delay:-1.4s]">
          <div className="flex items-center gap-3">
            <AudioWaveform className="h-5 w-5 text-plasma" aria-hidden="true" />
            <div>
              <div className="text-sm font-bold text-white">Beat sync ready</div>
              <div className="text-xs text-slate-400">18 cuts mapped</div>
            </div>
          </div>
        </div>
        <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-plasma/25 via-transparent to-aurora/25 blur-3xl sm:-inset-5" />
        <div className="preview-frame relative overflow-hidden rounded-3xl border border-white/15 bg-[#08101b]/80 shadow-2xl shadow-black/60 backdrop-blur-2xl">
          <div className="relative aspect-video min-h-0 sm:aspect-[16/10] sm:min-h-[310px]">
            <Image src="/lumora-motion-hero.png" alt="Futuristic Lumora Motion editing interface" fill priority sizes="(min-width: 1024px) 54vw, 100vw" className="object-cover opacity-85 transition duration-700 hover:scale-[1.03]" />
            <div className="scanline absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/20 to-transparent" />
            <div className="absolute inset-x-8 top-8 h-px animate-scan bg-gradient-to-r from-transparent via-plasma to-transparent" />
            <div className="absolute left-3 top-3 rounded-lg border border-white/10 bg-black/45 px-2.5 py-1.5 text-xs text-slate-200 shadow-glow backdrop-blur-xl sm:left-4 sm:top-4 sm:px-3 sm:py-2 sm:text-sm">Preview 01</div>
            <div className="absolute right-3 top-3 rounded-lg border border-signal/25 bg-signal/10 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-signal backdrop-blur-xl sm:right-4 sm:top-4 sm:px-3 sm:py-2 sm:text-xs sm:tracking-[0.22em]">AI online</div>
            <div className="absolute bottom-5 left-4 right-4 grid gap-2 sm:left-6 sm:right-6 sm:grid-cols-3">
              {["Hook", "Captions", "Grade"].map((label, index) => (
                <div key={label} className="rounded-xl border border-white/10 bg-black/45 p-3 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Clapperboard className="h-3.5 w-3.5 text-plasma" aria-hidden="true" />
                    {label}
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full bg-gradient-to-r ${index === 1 ? "from-signal to-plasma w-[82%]" : index === 2 ? "from-aurora to-white w-[66%]" : "from-plasma to-white w-[92%]"} animate-bar-shimmer`} />
                  </div>
                </div>
              ))}
            </div>
            <button className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/15 text-white shadow-glow backdrop-blur-md transition duration-300 hover:scale-110 sm:h-20 sm:w-20" aria-label="Play preview">
              <span className="absolute inset-0 rounded-full border border-plasma/40 animate-ping" />
              <Play className="relative ml-1 h-6 w-6 fill-white sm:h-8 sm:w-8" aria-hidden="true" />
            </button>
          </div>
          <div className="border-t border-white/10 bg-[#060a12]/90 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Demo video preview</p>
                <h2 className="mt-1 break-words font-[var(--font-space)] text-xl font-bold text-white sm:text-2xl">
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
            <div className="mt-5 rounded-xl border border-plasma/20 bg-plasma/[0.06] px-3 py-3 text-[10px] uppercase tracking-[0.16em] text-plasma sm:px-4 sm:text-xs sm:tracking-[0.22em]">
              {brand.watermark}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
