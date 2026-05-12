"use client";

import { useMemo, useState } from "react";
import { AppBackground } from "@/components/layout/app-background";
import { AiActivitySidebar } from "@/components/layout/ai-activity-sidebar";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AuthSection } from "@/components/sections/auth-section";
import { DashboardSection } from "@/components/sections/dashboard-section";
import { DemoSection } from "@/components/sections/demo-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { HeroSection } from "@/components/sections/hero-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { TemplatesSection } from "@/components/sections/templates-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { DashboardSummary } from "@/components/studio/dashboard-summary";
import { ProcessingPanel } from "@/components/studio/processing-panel";
import { PromptPanel } from "@/components/studio/prompt-panel";
import { ResultsSection } from "@/components/studio/results-section";
import { UploadPanel } from "@/components/studio/upload-panel";
import { SectionHeader } from "@/components/ui/section-header";
import { useAiRenderWorkflow } from "@/hooks/use-ai-render-workflow";
import { useVideoUpload } from "@/hooks/use-video-upload";
import { brand, presetPrompts, presets } from "@/lib/lumora-motion-data";

export default function Home() {
  const [selectedPreset, setSelectedPreset] = useState("Viral TikTok");
  const [prompt, setPrompt] = useState(
    "Turn this raw clip into a viral cinematic short with fast intelligent cuts, neon-grade highlights, clean captions, and a dramatic final product reveal."
  );
  const [trimDuration, setTrimDuration] = useState(12);
  const [trimStart, setTrimStart] = useState(0);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
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
      <HeroSection selectedPreset={selected.name} />
      <AiActivitySidebar />
      <DemoSection />
      <FeaturesSection />

      <section id="studio" className="relative px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="AI studio"
          title="Prompt, process, and export"
          copy={`The core ${brand.name} workflow combines upload, prompt, credit-aware processing, and real FFmpeg export controls.`}
        />
        <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
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
            selectedPreset={selectedPreset}
            isGenerating={render.isGenerating}
            onPrompt={setPrompt}
            onGenerate={() =>
              render.generateEdit({
                file: upload.videoFile,
                preset: selectedPreset,
                prompt,
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

        <div className="mx-auto mt-6 grid w-full max-w-7xl min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
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
          onComparison={render.setComparison}
          onQuality={render.setSelectedQuality}
        />
      </section>

      <TemplatesSection />
      <DashboardSection />
      <PricingSection billing={billing} onBilling={setBilling} />
      <TestimonialsSection />
      <FaqSection />
      <AuthSection />
      <Footer />
    </main>
  );
}
