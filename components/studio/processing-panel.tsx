import { Loader2 } from "lucide-react";
import { processingSteps } from "@/lib/lumora-motion-data";

export function ProcessingPanel({
  isGenerating,
  activeStep,
  renderError,
  renderLogs,
  renderProgress,
  renderStatus
}: {
  isGenerating: boolean;
  activeStep: number;
  renderError: string;
  renderLogs: string[];
  renderProgress: number;
  renderStatus: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">AI processing</p>
          <h2 className="mt-1 font-[var(--font-space)] text-2xl font-bold text-white">Neural render stack</h2>
        </div>
        <Loader2 className={`h-6 w-6 text-plasma ${isGenerating ? "animate-spin" : ""}`} aria-hidden="true" />
      </div>
      <div className="mt-5 rounded-xl border border-white/10 bg-black/25 p-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold text-white">{renderStatus}</span>
          <span className="text-plasma">{renderProgress}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-plasma via-white to-aurora transition-all duration-500"
            style={{ width: `${renderProgress}%` }}
          />
        </div>
        {renderError ? (
          <div className="mt-4 rounded-xl border border-rose-400/25 bg-rose-500/10 p-3 text-sm leading-6 text-rose-200">
            {renderError}
          </div>
        ) : null}
      </div>
      <div className="mt-6 space-y-3">
        {processingSteps.map((title, index) => {
          const complete = activeStep > index || (!isGenerating && activeStep === processingSteps.length - 1);
          const active = isGenerating && activeStep === index;
          return (
            <div key={title} className={`rounded-xl border p-4 transition duration-300 ${active ? "border-plasma/50 bg-plasma/10 shadow-glow" : complete ? "border-signal/25 bg-signal/[0.06]" : "border-white/10 bg-white/[0.035]"}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-white">{title}</span>
                <span className="text-sm text-slate-400">{active ? "processing" : complete ? "complete" : "queued"}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className={`h-full rounded-full bg-gradient-to-r from-plasma via-white to-aurora transition-all duration-500 ${active ? "animate-processing" : ""}`} style={{ width: complete ? "100%" : active ? undefined : "8%" }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
        <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Processing logs
        </div>
        <div className="mt-3 max-h-44 space-y-2 overflow-y-auto pr-1 text-xs leading-5 text-slate-400">
          {renderLogs.length ? (
            renderLogs.map((log, index) => (
              <div key={`${log}-${index}`} className="rounded-lg bg-white/[0.035] px-3 py-2">
                {log}
              </div>
            ))
          ) : (
            <div className="rounded-lg bg-white/[0.035] px-3 py-2">
              Upload a video and click Generate Edit to start FFmpeg processing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
