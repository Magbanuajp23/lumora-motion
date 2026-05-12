import { BarChart3, Layers3, Loader2, MessageSquareText, Sparkles, Upload } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { featureHighlights, workflowSteps } from "@/lib/lumora-motion-data";

const features = [
  [Upload, "Smart Uploads", "Drag MP4, MOV, and WebM files into a glass timeline with instant preview metadata."],
  [MessageSquareText, "Prompt Editing", "Describe your edit style with chips, presets, and a cinematic prompt canvas."],
  [Loader2, "AI Render Flow", "Watch a staged neural edit pipeline process scenes, captions, audio, and export prep."],
  [BarChart3, "Creator Analytics", "Track viral score, captions, transitions, optimized scenes, and render quality."]
] as const;

export function FeaturesSection() {
  return (
    <section id="features" className="relative border-y border-white/10 bg-[#03050a]/90 px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Features"
        title="A complete AI creator cockpit"
        copy="Upload, prompt, render, compare, export, and track credit-aware creative performance from one futuristic workspace."
      />
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(([Icon, title, copy]) => (
          <div key={title} className="glass-panel rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-plasma/40 hover:shadow-glow">
            <Icon className="h-7 w-7 text-plasma" aria-hidden="true" />
            <h3 className="mt-5 font-[var(--font-space)] text-xl font-bold text-white">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 grid max-w-7xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-plasma" aria-hidden="true" />
            <h3 className="font-[var(--font-space)] text-2xl font-black text-white">AI workflow</h3>
          </div>
          <div className="mt-5 grid gap-3">
            {workflowSteps.map(([step, title, copy]) => (
              <div key={step} className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:grid-cols-[4rem_1fr]">
                <div className="font-[var(--font-space)] text-2xl font-black text-plasma">{step}</div>
                <div>
                  <div className="font-bold text-white">{title}</div>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <Layers3 className="h-6 w-6 text-aurora" aria-hidden="true" />
            <h3 className="font-[var(--font-space)] text-2xl font-black text-white">Feature highlights</h3>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {featureHighlights.map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition duration-300 hover:-translate-y-1 hover:border-aurora/40">
                <div className="font-bold text-white">{title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
