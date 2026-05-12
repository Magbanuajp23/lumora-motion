import { useState } from "react";
import { brand, processingSteps, renderQualities } from "@/lib/lumora-motion-data";

type RenderStreamEvent =
  | { type: "log"; message: string }
  | { type: "progress"; progress: number; step: string }
  | { type: "complete"; outputUrl: string; jobId: string; logs: string[] }
  | { type: "error"; message: string; logs: string[] };

export function useAiRenderWorkflow() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [comparison, setComparison] = useState(58);
  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStatus, setRenderStatus] = useState("Waiting for uploaded video");
  const [renderLogs, setRenderLogs] = useState<string[]>([]);
  const [renderError, setRenderError] = useState("");
  const [outputUrl, setOutputUrl] = useState("");

  const renderTime =
    renderQualities.find((quality) => quality.label === selectedQuality)?.time ??
    renderQualities[1].time;

  async function generateEdit({
    file,
    preset,
    prompt,
    trimDuration,
    trimStart
  }: {
    file: File | null;
    preset: string;
    prompt: string;
    trimDuration: number;
    trimStart: number;
  }) {
    if (!file) {
      setRenderError("Upload a video before generating an edit.");
      setRenderStatus("Upload required");
      return;
    }

    setIsGenerating(true);
    setActiveStep(0);
    setRenderProgress(3);
    setRenderStatus("Uploading video to render worker");
    setRenderLogs([`Submitting video to ${brand.name} FFmpeg pipeline...`]);
    setRenderError("");
    setOutputUrl("");

    const formData = new FormData();
    formData.append("video", file);
    formData.append("preset", preset);
    formData.append("prompt", prompt);
    formData.append("quality", selectedQuality);
    formData.append("trimDuration", String(trimDuration));
    formData.append("trimStart", String(trimStart));

    try {
      const response = await fetch("/api/render", {
        method: "POST",
        body: formData
      });

      if (!response.ok || !response.body) {
        throw new Error("Render request failed before processing started.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          let event: RenderStreamEvent;

          try {
            event = JSON.parse(line) as RenderStreamEvent;
          } catch {
            throw new Error(`Render worker returned an unreadable event: ${line}`);
          }

          if (event.type === "log") {
            setRenderLogs((current) => [...current, event.message]);
          }

          if (event.type === "progress") {
            setRenderProgress(event.progress);
            setRenderStatus(event.step);
            const stepIndex = processingSteps.findIndex((step) => step === event.step);
            if (stepIndex >= 0) setActiveStep(stepIndex);
          }

          if (event.type === "complete") {
            setRenderProgress(100);
            setRenderStatus("Render complete");
            setOutputUrl(event.outputUrl);
            setRenderLogs(event.logs);
            setActiveStep(processingSteps.length - 1);
          }

          if (event.type === "error") {
            setRenderError(event.message);
            setRenderStatus("Render failed");
            setRenderLogs(event.logs);
            setIsGenerating(false);
            return;
          }
        }
      }
    } catch (error) {
      setRenderError(error instanceof Error ? error.message : "Render failed.");
      setRenderStatus("Render failed");
    } finally {
      setIsGenerating(false);
    }
  }

  return {
    activeStep,
    comparison,
    generateEdit,
    isGenerating,
    outputUrl,
    renderTime,
    renderError,
    renderLogs,
    renderProgress,
    renderStatus,
    selectedQuality,
    setComparison,
    setSelectedQuality
  };
}
