"use client";

import { useMemo, useState } from "react";
import { Clapperboard, Sparkles } from "lucide-react";
import { AppBackground } from "@/components/layout/app-background";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { DashboardSummary } from "@/components/studio/dashboard-summary";
import { ProcessingPanel } from "@/components/studio/processing-panel";
import { PromptPanel } from "@/components/studio/prompt-panel";
import { ResultsSection } from "@/components/studio/results-section";
import { UploadPanel } from "@/components/studio/upload-panel";
import { useAiRenderWorkflow } from "@/hooks/use-ai-render-workflow";
import { useVideoUpload } from "@/hooks/use-video-upload";
import { brand, presetPrompts, presets } from "@/lib/lumora-motion-data";

export default function StudioPage() {
  const [selectedPreset, setSelectedPreset] = useState("Cinematic");
  const [prompt, setPrompt] = useState(
    "Transform this raw footage into a premium cinematic short with a strong hook, clean captions, smooth pacing, and a polished export-ready finish."
  );
  const [trimDuration, setTrimDuration] = useState(12);
  const [trimStart, setTrimStart] = useState(0);
  const [captions, setCaptions] = useState(
    "Raw footage to cinematic edit\nRendered with Lumora Motion"
  );
  const [captionStyle, setCaptionStyle] = useState("bold-white");
  const [showWatermark, setShowWatermark] = useState(true);
  const upload = useVideoUpload();
  const render = useAiRenderWorkflow();

  const selected = useMemo(
    () => presets.find((preset) => preset.name === selectedPreset) ?? presets[0],
    [selectedPreset]
  );

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#03050a] text-slate-100">
      <AppBackground />
      <Navbar />

      <section id="studio" className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
        <div className="particle-field pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute left-[12%] top-10 h-80 w-80 rounded-full bg-plasma/10 blur-3xl" />
        <div className="pointer-events-none absolute right-[8%] top-24 h-96 w-96 rounded-full bg-aurora/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.55fr)] lg:items-end">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-plasma/25 bg-plasma/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-plasma shadow-glow">
                <Clapperboard className="h-4 w-4" aria-hidden="true" />
                AI creator studio
              </div>
              <h1 className="mt-5 font-[var(--font-space)] text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
                Build cinematic edits from raw clips.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-xl sm:leading-8">
                Upload footage, direct the AI with prompts and presets, monitor the neural render stack, then export a creator-ready MP4.
              </p>
            </div>
            <div className="glass-panel rounded-3xl p-5">
              <div className="flex items-center gap-3">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${selected.accent} text-[#05070d] shadow-glow`}>
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Active preset</p>
                  <h2 className="font-[var(--font-space)] text-2xl font-black text-white">{selected.name}</h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{selected.detail}</p>
            </div>
          </div>

          <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <UploadPanel
              fileName={upload.fileName}
              fileSize={upload.fileSize}
              duration={upload.duration}
              videoUrl={upload.videoUrl}
              uploadProgress={upload.uploadProgress}
              uploadState={upload.uploadState}
              uploadError={upload.uploadError}
              isDragging={upload.isDragging}
              fileInputRef={upload.fileInputRef}
              onDrop={upload.handleDrop}
              onDragEnter={(event) => {
                event.preventDefault();
                upload.setIsDragging(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => upload.setIsDragging(false)}
              onFile={upload.handleVideoFile}
              onDuration={upload.setDuration}
              onClear={upload.resetUpload}
            />
            <PromptPanel
              prompt={prompt}
              captions={captions}
              captionStyle={captionStyle}
              selectedPreset={selectedPreset}
              isGenerating={render.isGenerating}
              canGenerate={Boolean(upload.videoFile)}
              showWatermark={showWatermark}
              onPrompt={setPrompt}
              onCaptions={setCaptions}
              onCaptionStyle={setCaptionStyle}
              onWatermark={setShowWatermark}
              onGenerate={() =>
                render.generateEdit({
                  captionStyle,
                  captions,
                  file: upload.videoFile,
                  preset: selectedPreset,
                  prompt,
                  showWatermark,
                  trimDuration,
                  trimStart
                })
              }
              onTrimDuration={setTrimDuration}
              onTrimStart={setTrimStart}
              onPreset={(name) => {
                setSelectedPreset(name);
                setPrompt(presetPrompts[name]);
              }}
              trimDuration={trimDuration}
              trimStart={trimStart}
            />
          </div>

          <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
            <ProcessingPanel
              isGenerating={render.isGenerating}
              activeStep={render.activeStep}
              renderError={render.renderError}
              renderLogs={render.renderLogs}
              renderProgress={render.renderProgress}
              renderStatus={render.renderStatus}
            />
            <DashboardSummary />
          </div>

          <ResultsSection
            selectedPreset={selectedPreset}
            comparison={render.comparison}
            selectedQuality={render.selectedQuality}
            renderTime={render.renderTime}
            outputUrl={render.outputUrl}
            renderError={render.renderError}
            renderLogs={render.renderLogs}
            renderProgress={render.renderProgress}
            renderStatus={render.renderStatus}
            sourceVideoUrl={upload.videoUrl}
            onComparison={render.setComparison}
            onQuality={render.setSelectedQuality}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
