import { useState } from "react";
import { brand, processingSteps, renderQualities } from "@/lib/lumora-motion-data";

type RenderStreamEvent =
  | { type: "log"; message: string }
  | { type: "progress"; progress: number; step: string }
  | { type: "complete"; outputUrl?: string; downloadUrl?: string; jobId: string; logs: string[] }
  | { type: "error"; message: string; logs: string[] };

type RenderStatusResponse = {
  directRenderUrl?: string | null;
  detail?: string;
  maxUploadBytes?: number;
  message?: string;
  mode?: "local" | "remote" | "disabled";
  remoteHealth?: {
    error?: string;
    ok: boolean;
    status?: number;
    url: string;
  } | null;
};

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
    captions,
    captionStyle,
    file,
    preset,
    prompt,
    showWatermark,
    trimDuration,
    trimStart
  }: {
    captions: string;
    captionStyle: string;
    file: File | null;
    preset: string;
    prompt: string;
    showWatermark: boolean;
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
    setRenderProgress(0);
    setRenderStatus("Checking render backend");
    setRenderLogs([
      `Preparing ${brand.name} render request...`,
      "Valid source video detected. Building edit instructions from your prompt."
    ]);
    setRenderError("");
    setOutputUrl("");

    try {
      const backendStatus = await getRenderStatus();
      console.info("[Lumora Motion] Render backend status", backendStatus);

      if (backendStatus.mode === "disabled") {
        const message =
          backendStatus.message ||
          "Online video rendering is not available yet. Please run locally or connect a render backend.";

        setRenderError(message);
        setRenderStatus("Render backend unavailable");
        setRenderProgress(0);
        setRenderLogs([
          message,
          backendStatus.detail ||
            "This deployment is configured without a dedicated render worker."
        ]);
        return;
      }

      if (backendStatus.mode === "remote" && backendStatus.remoteHealth?.ok === false) {
        throw new Error(
          `Render backend health check failed at ${backendStatus.remoteHealth.url}. ${
            backendStatus.remoteHealth.error || `Status ${backendStatus.remoteHealth.status || "unknown"}`
          }`
        );
      }

      if (backendStatus.maxUploadBytes && file.size > backendStatus.maxUploadBytes) {
        throw new Error(
          `This video is too large for the current render endpoint. Maximum upload size is ${formatBytes(
            backendStatus.maxUploadBytes
          )}; selected file is ${formatBytes(file.size)}.`
        );
      }

      setRenderProgress(4);
      setRenderStatus("Uploading video to render worker");
      setRenderLogs((current) => [
        ...current,
        backendStatus.message || `Submitting video to ${brand.name} FFmpeg pipeline...`,
        `Selected preset: ${preset}. Export quality: ${selectedQuality}.`
      ]);

      const formData = new FormData();
      formData.append("video", file);
      formData.append("preset", preset);
      formData.append("prompt", prompt);
      formData.append("captions", captions);
      formData.append("captionStyle", captionStyle);
      formData.append("watermark", String(showWatermark));
      formData.append("quality", selectedQuality);
      formData.append("trimDuration", String(trimDuration));
      formData.append("trimStart", String(trimStart));

      const renderEndpoint =
        backendStatus.mode === "remote" && backendStatus.directRenderUrl
          ? backendStatus.directRenderUrl
          : "/api/render";

      setRenderLogs((current) => [
        ...current,
        backendStatus.mode === "remote"
          ? "Uploading directly to the production FFmpeg render backend to avoid Vercel upload limits."
          : "Using the local Lumora Motion FFmpeg render route."
      ]);
      console.info("[Lumora Motion] Submitting render job", {
        endpoint: renderEndpoint,
        fileSize: file.size,
        preset,
        quality: selectedQuality
      });

      const response = await fetch(renderEndpoint, {
        method: "POST",
        body: formData
      });

      if (!response.ok || !response.body) {
        const message = await readRenderError(response);
        console.error("[Lumora Motion] Render request failed", {
          endpoint: renderEndpoint,
          message,
          status: response.status
        });
        throw new Error(message);
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
            const finalOutputUrl = normalizeOutputUrl(
              event.outputUrl || event.downloadUrl || `/api/render/${event.jobId}`,
              backendStatus
            );

            console.info("[Lumora Motion] Render complete event", {
              event,
              finalOutputUrl
            });
            setRenderProgress(100);
            setRenderStatus("Render complete");
            setOutputUrl(finalOutputUrl);
            setRenderLogs([
              ...event.logs,
              `Generated preview URL: ${finalOutputUrl}`,
              "Generated preview is ready. Export/download is now enabled."
            ]);
            setActiveStep(processingSteps.length - 1);
          }

          if (event.type === "error") {
            console.error("[Lumora Motion] Render worker returned an error", event);
            setRenderError(event.message);
            setRenderStatus("Render failed");
            setRenderLogs(event.logs);
            setIsGenerating(false);
            return;
          }
        }
      }
    } catch (error) {
      console.error("[Lumora Motion] Generate Edit failed", error);
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

async function getRenderStatus(): Promise<RenderStatusResponse> {
  try {
    const response = await fetch("/api/render/status", { cache: "no-store" });
    if (!response.ok) return {};
    return (await response.json()) as RenderStatusResponse;
  } catch (error) {
    console.error("[Lumora Motion] Could not read render status", error);
    return {};
  }
}

async function readRenderError(response: Response) {
  const fallback = response.statusText || "Render request failed before processing started.";

  try {
    const body = await response.clone().json();
    if (typeof body?.error === "string") return body.error;
    if (typeof body?.message === "string") return body.message;
  } catch {
    // Fall through to plain text parsing.
  }

  try {
    const text = await response.text();
    return text.trim() || fallback;
  } catch {
    return fallback;
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function normalizeOutputUrl(outputUrl: string, backendStatus: RenderStatusResponse) {
  if (backendStatus.mode === "remote" && backendStatus.directRenderUrl) {
    const backendOrigin = new URL(backendStatus.directRenderUrl).origin;

    if (/^https?:\/\//i.test(outputUrl)) {
      const parsed = new URL(outputUrl);

      if (isLocalOutputHost(parsed.host)) {
        const rewritten = `${backendOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
        console.warn("[Lumora Motion] Rewrote local render output URL to production backend URL", {
          original: outputUrl,
          rewritten
        });
        return rewritten;
      }

      return outputUrl;
    }

    return `${backendOrigin}${outputUrl.startsWith("/") ? outputUrl : `/${outputUrl}`}`;
  }

  return outputUrl;
}

function isLocalOutputHost(host: string) {
  return /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(host);
}
