import Image from "next/image";
import { CheckCircle2, Download, Play, Rocket } from "lucide-react";
import { aiStats, brand, renderQualities } from "@/lib/lumora-motion-data";

export function ResultsSection(props: {
  selectedPreset: string;
  comparison: number;
  selectedQuality: string;
  renderTime: string;
  outputUrl: string;
  renderError: string;
  renderLogs: string[];
  renderProgress: number;
  renderStatus: string;
  sourceVideoUrl: string;
  onComparison: (value: number) => void;
  onQuality: (value: string) => void;
}) {
  const hasOutput = Boolean(props.outputUrl);
  const hasError = Boolean(props.renderError);
  const badgeText = hasOutput
    ? "AI success: render complete"
    : hasError
      ? "Render needs attention"
      : "AI render preview";
  const headline = hasOutput ? "Cinematic render results" : "Export preview";

  return (
    <div id="results" className="mx-auto mt-6 w-full max-w-7xl min-w-0">
      <div className="glass-panel overflow-hidden rounded-3xl">
        <div className="border-b border-white/10 bg-gradient-to-r from-signal/[0.08] via-plasma/[0.08] to-aurora/[0.08] p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-signal/25 bg-signal/10 px-3 py-2 text-xs font-semibold text-signal sm:text-sm">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span className="truncate">{badgeText}</span>
              </div>
              <h2 className="mt-4 break-words font-[var(--font-space)] text-2xl font-black text-white sm:text-4xl">{headline}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">{brand.name} generated a polished creator-ready cut with captions, transitions, pacing optimization, and export-ready delivery.</p>
            </div>
            <div className="render-burst relative grid h-24 w-full min-w-0 place-items-center rounded-2xl border border-plasma/20 bg-black/25 sm:max-w-xs lg:w-64">
              <Rocket className="h-8 w-8 text-plasma" aria-hidden="true" />
              <span className="absolute bottom-3 text-xs uppercase tracking-[0.22em] text-slate-500">Neural export sealed</span>
            </div>
          </div>
        </div>
        <div className="grid min-w-0 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <div className="min-w-0 space-y-5">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              <div className="relative aspect-video min-h-0">
                {props.outputUrl ? (
                  <video
                    src={props.outputUrl}
                    className="absolute inset-0 h-full w-full object-cover"
                    controls
                    playsInline
                  />
                ) : (
                  <>
                    <Image src="/lumora-motion-hero.png" alt="Rendered Lumora Motion video result" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover opacity-95" />
                    <button className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/15 text-white shadow-glow backdrop-blur-md transition duration-300 hover:scale-110" aria-label="Play rendered preview">
                      <Play className="ml-1 h-7 w-7 fill-white" aria-hidden="true" />
                    </button>
                  </>
                )}
                <div className="scanline pointer-events-none absolute inset-0" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <div className="absolute left-3 top-3 max-w-[62%] rounded-lg border border-signal/25 bg-signal/10 px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-signal backdrop-blur-xl sm:left-4 sm:top-4 sm:px-3 sm:py-2 sm:text-xs sm:tracking-[0.2em]">Generated video result</div>
                <div className="absolute bottom-3 right-3 max-w-[58%] rounded-lg border border-plasma/25 bg-plasma/10 px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-plasma backdrop-blur-xl sm:right-4 sm:top-4 sm:bottom-auto sm:px-3 sm:py-2 sm:text-xs sm:tracking-[0.2em]">{brand.watermark}</div>
                <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-black/45 p-3 backdrop-blur-xl sm:bottom-4 sm:left-4 sm:right-4">
                  <div className="flex items-center justify-between gap-3 text-xs text-slate-300 sm:text-sm">
                    <span className="min-w-0 truncate">{props.selectedPreset} final cut</span>
                    <span>{props.outputUrl ? "processed" : "waiting"}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-plasma via-white to-aurora animate-bar-shimmer" style={{ width: `${Math.max(props.renderProgress, 8)}%` }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Before / after</p>
                  <h3 className="mt-1 font-[var(--font-space)] text-xl font-bold text-white">AI enhancement comparison</h3>
                </div>
                <span className="text-sm text-slate-400">{props.comparison}% after</span>
              </div>
              <div className="relative mt-4 aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                {props.sourceVideoUrl ? (
                  <video
                    src={props.sourceVideoUrl}
                    className="absolute inset-0 h-full w-full object-cover grayscale contrast-75 brightness-50"
                    muted
                    playsInline
                  />
                ) : (
                  <Image src="/lumora-motion-hero.png" alt="Before video frame" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover grayscale contrast-75 brightness-50" />
                )}
                <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - props.comparison}% 0 0)` }}>
                  {props.outputUrl ? (
                    <video
                      src={props.outputUrl}
                      className="absolute inset-0 h-full w-full object-cover saturate-150 contrast-125"
                      muted
                      playsInline
                    />
                  ) : (
                    <Image src="/lumora-motion-hero.png" alt="After AI enhanced video frame" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover saturate-150 contrast-125" />
                  )}
                </div>
                <div className="absolute inset-y-0 w-px bg-white shadow-glow" style={{ left: `${props.comparison}%` }} />
                <span className="absolute left-3 top-3 rounded-md bg-black/55 px-2 py-1 text-xs text-slate-300 backdrop-blur">Before</span>
                <span className="absolute right-3 top-3 rounded-md bg-plasma/15 px-2 py-1 text-xs text-plasma backdrop-blur">After</span>
              </div>
              <input type="range" min="8" max="92" value={props.comparison} onChange={(event) => props.onComparison(Number(event.target.value))} className="mt-4 w-full accent-cyan-300" aria-label="Before and after comparison" />
            </div>
          </div>
          <div className="min-w-0 space-y-5">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Export quality</p>
              <div className="mt-4 grid gap-2">
                {renderQualities.map((quality) => (
                  <button key={quality.label} onClick={() => props.onQuality(quality.label)} className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition duration-300 ${props.selectedQuality === quality.label ? "border-plasma/55 bg-plasma/10 text-white shadow-glow" : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25"}`}>
                    <span className="font-bold">{quality.label}</span>
                    <span className="shrink-0 text-sm text-slate-400">{quality.time}</span>
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <div className="text-sm text-slate-400">Estimated render time</div>
                <div className="mt-1 font-[var(--font-space)] text-3xl font-black text-white">{props.renderTime}</div>
              </div>
              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <div className="text-sm text-slate-400">Render status</div>
                <div className="mt-1 font-semibold text-white">{props.renderStatus}</div>
                {props.renderError ? (
                  <div className="mt-2 text-sm text-rose-300">{props.renderError}</div>
                ) : null}
              </div>
              <a
                href={props.outputUrl || undefined}
                download
                aria-disabled={!props.outputUrl}
                className={`mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-black transition duration-300 ${
                  props.outputUrl
                    ? "bg-white text-[#05070d] hover:-translate-y-0.5 hover:bg-slate-200"
                    : "pointer-events-none border border-white/10 bg-white/[0.04] text-slate-500"
                }`}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Export / Download
              </a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">AI stats</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {aiStats.map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                    <div className="text-sm text-slate-400">{label}</div>
                    <div className="mt-1 font-[var(--font-space)] text-2xl font-black text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
