"use client";

import { useEffect, useState } from "react";
import { AuthRedirectNotice } from "@/components/auth/auth-redirect-notice";
import { AppBackground } from "@/components/layout/app-background";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AuthSection } from "@/components/sections/auth-section";
import { DashboardSection } from "@/components/sections/dashboard-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { HeroSection } from "@/components/sections/hero-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { TransformationsSection } from "@/components/sections/transformations-section";
import { DashboardSummary } from "@/components/studio/dashboard-summary";
import { ProcessingPanel } from "@/components/studio/processing-panel";
import { PromptPanel } from "@/components/studio/prompt-panel";
import { ResultsSection } from "@/components/studio/results-section";
import { UploadPanel } from "@/components/studio/upload-panel";
import { SectionHeader } from "@/components/ui/section-header";
import { useAiRenderWorkflow } from "@/hooks/use-ai-render-workflow";
import { useVideoUpload } from "@/hooks/use-video-upload";
import { brand, presetPrompts } from "@/lib/lumora-motion-data";
import { getSupabaseClient } from "@/lib/supabase-client";

export default function Home() {
  const [selectedPreset, setSelectedPreset] = useState("Viral TikTok");
  const [prompt, setPrompt] = useState(
    "Turn this raw clip into a viral cinematic short with fast intelligent cuts, neon-grade highlights, clean captions, and a dramatic final product reveal."
  );
  const [trimDuration, setTrimDuration] = useState(12);
  const [trimStart, setTrimStart] = useState(0);
  const [captions, setCaptions] = useState(
    "Raw clip to viral cut\nBuilt with Lumora Motion"
  );
  const [captionStyle, setCaptionStyle] = useState("tiktok-subtitles");
  const [showWatermark, setShowWatermark] = useState(true);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const upload = useVideoUpload();
  const render = useAiRenderWorkflow();

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(Boolean(data.session));
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#03050a] text-slate-100">
      <AppBackground />
      <Navbar />
      <AuthRedirectNotice />

      {isLoggedIn ? null : <HeroSection selectedPreset={selectedPreset} />}

      {isLoggedIn ? (
        <section id="studio" className="relative scroll-mt-24 overflow-hidden border-y border-white/10 bg-[#03050a]/80 px-4 py-16 sm:px-6 lg:px-8">
          <div className="particle-field pointer-events-none absolute inset-0 opacity-35" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-plasma/10 blur-3xl" />
          <SectionHeader
            eyebrow="Lumora Motion studio"
            title="Upload, prompt, render, export"
            copy={`Start with the core ${brand.name} workspace: drag in a video, choose a cinematic preset, describe the edit, and export an AI-assisted cut.`}
          />
          <div className="relative mx-auto grid w-full max-w-7xl min-w-0 gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
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

          <div className="relative mx-auto mt-6 grid w-full max-w-7xl min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
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
        </section>
      ) : null}

      {isLoggedIn ? <DashboardSection /> : null}
      <FeaturesSection />

      <TransformationsSection />
      <PricingSection billing={billing} onBilling={setBilling} />
      <TestimonialsSection />
      <FaqSection />
      {isLoggedIn ? null : <AuthSection />}
      <Footer />
    </main>
  );
}
