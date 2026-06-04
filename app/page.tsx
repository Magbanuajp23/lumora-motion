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
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [hasConfirmedStudioUnlock, setHasConfirmedStudioUnlock] = useState(false);
  const upload = useVideoUpload();
  const render = useAiRenderWorkflow();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authState = params.get("auth");
    setHasConfirmedStudioUnlock(params.get("confirmed") === "true" || authState === "confirmed");

    const supabase = getSupabaseClient();

    if (!supabase) {
      setIsAuthChecking(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(Boolean(data.session));
      setIsAuthChecking(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session));
      setIsAuthChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const shouldShowStudioWorkspace = isLoggedIn || hasConfirmedStudioUnlock;
  const isStudioLocked = !isLoggedIn;

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#03050a] text-slate-100">
      <AppBackground />
      <Navbar />
      <AuthRedirectNotice />

      {shouldShowStudioWorkspace ? null : <HeroSection selectedPreset={selectedPreset} />}

      {shouldShowStudioWorkspace ? (
        <section id="studio" className="relative scroll-mt-24 overflow-hidden border-y border-white/10 bg-[#03050a]/80 px-4 py-16 sm:px-6 lg:px-8">
          <div className="particle-field pointer-events-none absolute inset-0 opacity-35" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-plasma/10 blur-3xl" />
          <SectionHeader
            eyebrow="Lumora Motion studio"
            title="Upload, prompt, render, export"
            copy={`Start with the core ${brand.name} workspace: drag in a video, choose a cinematic preset, describe the edit, and export an AI-assisted cut.`}
          />
          {isStudioLocked ? (
            <div className="relative mx-auto mb-6 max-w-3xl rounded-2xl border border-plasma/20 bg-black/45 p-5 text-center shadow-[0_0_40px_rgba(32,217,255,0.12)] backdrop-blur-2xl">
              <p className="font-[var(--font-space)] text-xl font-black text-white">
                Please log in to start editing.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {isAuthChecking
                  ? "Checking your Supabase session before unlocking uploads, rendering, and export."
                  : "Your email is confirmed, but no active session is available yet. Log in to unlock uploads, AI rendering, and exports."}
              </p>
              <a
                href="#login"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-black text-[#05070d] transition hover:-translate-y-0.5 hover:bg-slate-200"
              >
                Login
              </a>
            </div>
          ) : null}
          <div className="relative mx-auto grid w-full max-w-7xl min-w-0 gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <UploadPanel
              fileName={upload.fileName}
              fileSize={upload.fileSize}
              duration={upload.duration}
              videoMetadata={upload.videoMetadata}
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
              onVideoMetadata={upload.handleVideoMetadata}
              onClear={upload.resetUpload}
              isLocked={isStudioLocked}
            />
            <PromptPanel
              prompt={prompt}
              captions={captions}
              captionStyle={captionStyle}
              selectedPreset={selectedPreset}
              isGenerating={render.isGenerating}
              canGenerate={Boolean(upload.videoFile) && !isStudioLocked}
              isLocked={isStudioLocked}
              showWatermark={showWatermark}
              onPrompt={setPrompt}
              onCaptions={setCaptions}
              onCaptionStyle={setCaptionStyle}
              onWatermark={setShowWatermark}
              onGenerate={() =>
                isStudioLocked
                  ? undefined
                  : render.generateEdit({
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
            selectedQuality={render.selectedQuality}
            renderTime={render.renderTime}
            outputUrl={render.outputUrl}
            renderError={render.renderError}
            renderLogs={render.renderLogs}
            renderProgress={render.renderProgress}
            renderStatus={render.renderStatus}
            onQuality={render.setSelectedQuality}
            isLocked={isStudioLocked}
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
