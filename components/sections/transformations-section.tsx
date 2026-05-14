"use client";

import { useRef, type MutableRefObject } from "react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { showcaseStats, transformationShowcases } from "@/lib/lumora-motion-data";

export function TransformationsSection() {
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  function playPair(title: string) {
    const before = videoRefs.current[`${title}-before`];
    const after = videoRefs.current[`${title}-after`];
    before?.play().catch(() => undefined);
    after?.play().catch(() => undefined);
  }

  return (
    <section id="transformations" className="relative overflow-hidden border-y border-white/10 bg-[#03050a]/95 px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-plasma/10 to-transparent" />
      <div className="particle-field pointer-events-none absolute inset-0 opacity-40" />
      <SectionHeader
        eyebrow="AI transformations"
        title="Before & After AI Transformations"
        copy="Playable sample demos showing raw clips beside Lumora Motion rendered outputs with captions, grade, motion, and branded overlays."
      />

      <div className="mx-auto mb-8 grid w-full max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {showcaseStats.map(([value, label]) => (
          <div key={label} className="glass-card rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-plasma/35 hover:shadow-glow">
            <div className="font-[var(--font-space)] text-3xl font-black text-white">{value}</div>
            <div className="mt-1 text-sm text-slate-400">{label}</div>
          </div>
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-5 xl:grid-cols-2">
        {transformationShowcases.map((item) => (
          <article key={item.title} className="group glass-panel min-w-0 overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1 hover:border-plasma/35 hover:shadow-glow">
            <div className="border-b border-white/10 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full bg-gradient-to-r ${item.accent} px-3 py-1 text-xs font-black text-[#05070d]`}>
                      {item.preset}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-slate-300">
                      Render {item.renderTime}
                    </span>
                  </div>
                  <h3 className="mt-4 font-[var(--font-space)] text-2xl font-black text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => playPair(item.title)}
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-black text-[#05070d] transition duration-300 hover:-translate-y-0.5 hover:bg-slate-200"
                >
                  <Play className="h-4 w-4 fill-[#05070d]" aria-hidden="true" />
                  Play both
                </button>
              </div>
            </div>

            <div className="relative grid gap-0 md:grid-cols-2">
              <VideoPane
                label="Raw Footage"
                note={item.beforeNote}
                refKey={`${item.title}-before`}
                src={item.beforeVideo}
                tone="before"
                videoRefs={videoRefs}
              />
              <VideoPane
                label="Edited with Lumora Motion"
                note={item.afterNote}
                refKey={`${item.title}-after`}
                src={item.afterVideo}
                tone="after"
                videoRefs={videoRefs}
              />
              <div className={`pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-gradient-to-b ${item.accent} shadow-glow md:block`} />
              <div className="comparison-handle pointer-events-none absolute left-1/2 top-1/2 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-xl md:grid">
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function VideoPane({
  label,
  note,
  refKey,
  src,
  tone,
  videoRefs
}: {
  label: string;
  note: string;
  refKey: string;
  src: string;
  tone: "before" | "after";
  videoRefs: MutableRefObject<Record<string, HTMLVideoElement | null>>;
}) {
  return (
    <div className={`relative min-w-0 border-white/10 ${tone === "before" ? "border-b md:border-b-0 md:border-r" : ""}`}>
      <div className="relative aspect-video overflow-hidden bg-black">
        <video
          ref={(node) => {
            videoRefs.current[refKey] = node;
          }}
          src={src}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
          controls
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
        <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-white backdrop-blur-xl">
          {label}
        </div>
        {tone === "after" ? (
          <div className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-plasma/25 bg-plasma/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-plasma backdrop-blur-xl">
            Generated with Lumora Motion
          </div>
        ) : null}
        <div className="pointer-events-none absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/30 text-white opacity-0 shadow-glow backdrop-blur-xl transition duration-300 group-hover:opacity-100">
          <Play className="ml-1 h-6 w-6 fill-white" aria-hidden="true" />
        </div>
      </div>
      <div className="border-t border-white/10 bg-black/25 p-4">
        <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold ${tone === "after" ? "border-plasma/25 bg-plasma/10 text-white" : "border-white/10 bg-white/[0.035] text-slate-300"}`}>
          <Sparkles className="h-4 w-4 text-plasma" aria-hidden="true" />
          {note}
        </div>
      </div>
    </div>
  );
}
