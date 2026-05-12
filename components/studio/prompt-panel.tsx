import { BadgeCheck, BrainCircuit, Clapperboard, ImageUp, Loader2, MessageSquareText, Sparkles, WandSparkles, Zap } from "lucide-react";
import { presets, promptExamples } from "@/lib/lumora-motion-data";

const presetIcons = {
  zap: Zap,
  clapperboard: Clapperboard,
  badge: BadgeCheck,
  image: ImageUp,
  sparkles: Sparkles
};

export function PromptPanel({
  prompt,
  selectedPreset,
  isGenerating,
  onPrompt,
  onPreset,
  onGenerate,
  onTrimDuration,
  onTrimStart,
  trimDuration,
  trimStart
}: {
  prompt: string;
  selectedPreset: string;
  isGenerating: boolean;
  onPrompt: (prompt: string) => void;
  onPreset: (preset: string) => void;
  onGenerate: () => void;
  onTrimDuration: (duration: number) => void;
  onTrimStart: (start: number) => void;
  trimDuration: number;
  trimStart: number;
}) {
  return (
    <div className="glass-panel min-w-0 rounded-2xl p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Edit prompt</p>
          <h2 className="mt-1 font-[var(--font-space)] text-2xl font-bold text-white">Direct the AI cut</h2>
        </div>
        <button onClick={onGenerate} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-bold text-[#05070d] transition duration-300 hover:-translate-y-0.5 hover:bg-slate-200">
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
          {isGenerating ? "Generating" : "Generate Edit"}
        </button>
      </div>
      <div className="mt-6 rounded-3xl border border-plasma/15 bg-black/25 p-3 shadow-inner shadow-black/40 transition duration-300 focus-within:border-plasma/55 focus-within:shadow-glow">
        <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 px-2 pb-3 text-[10px] uppercase tracking-[0.14em] text-slate-500 sm:text-xs sm:tracking-[0.2em]">
          <span className="inline-flex min-w-0 items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-plasma" aria-hidden="true" />
            <span className="truncate">Cinematic prompt</span>
          </span>
          <span className="shrink-0">{prompt.length} chars</span>
        </div>
        <div className="mb-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-slate-400">
          <BrainCircuit className="h-4 w-4 text-signal" aria-hidden="true" />
          <span className="typing-line min-w-0 overflow-hidden whitespace-nowrap">
            AI is ready to structure hook, pacing, captions, beat sync, and cinematic grade.
          </span>
        </div>
        <textarea value={prompt} onChange={(event) => onPrompt(event.target.value)} rows={8} className="min-h-64 w-full resize-none bg-transparent p-3 text-base leading-7 text-slate-100 outline-none placeholder:text-slate-600 sm:min-h-72 sm:text-lg sm:leading-8" placeholder="Make this a viral TikTok edit with bold captions, fast pacing, and a strong final payoff..." />
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
          <WandSparkles className="h-4 w-4 text-plasma" aria-hidden="true" />
          Smart prompt suggestions
        </div>
        <div className="prompt-marquee flex gap-2">
          {[...promptExamples, ...promptExamples].map((example, index) => (
            <button key={`${example}-${index}`} onClick={() => onPrompt(example)} className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 transition duration-300 hover:border-plasma/40 hover:bg-plasma/10 hover:text-white">
              {example}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Trim start
          </span>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="30"
              value={trimStart}
              onChange={(event) => onTrimStart(Number(event.target.value))}
              className="w-full accent-cyan-300"
            />
            <span className="w-12 text-right text-sm text-plasma">{trimStart}s</span>
          </div>
        </label>
        <label className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Clip length
          </span>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="range"
              min="3"
              max="60"
              value={trimDuration}
              onChange={(event) => onTrimDuration(Number(event.target.value))}
              className="w-full accent-cyan-300"
            />
            <span className="w-12 text-right text-sm text-plasma">{trimDuration}s</span>
          </div>
        </label>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {presets.map((preset) => {
          const Icon = presetIcons[preset.icon as keyof typeof presetIcons];
          const active = selectedPreset === preset.name;
          return (
            <button key={preset.name} onClick={() => onPreset(preset.name)} className={`group min-h-40 rounded-2xl border p-4 text-left transition duration-300 hover:-translate-y-1 ${active ? "border-plasma/60 bg-plasma/10 shadow-glow" : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"}`}>
              <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${preset.accent} text-[#05070d] shadow-lg transition duration-300 group-hover:scale-105`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="mt-4 font-bold text-white">{preset.name}</div>
              <div className="mt-1 text-sm text-plasma/90">{preset.meta}</div>
              <p className="mt-3 text-xs leading-5 text-slate-400">{preset.detail}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
