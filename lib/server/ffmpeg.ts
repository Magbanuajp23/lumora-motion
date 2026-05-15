import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { buildRenderPlan, normalizeCaptions } from "@/lib/server/render-presets";

export type RenderEvent =
  | { type: "log"; message: string }
  | { type: "progress"; progress: number; step: string }
  | { type: "complete"; outputUrl: string; jobId: string; logs: string[] }
  | { type: "error"; message: string; logs: string[] };

type RenderOptions = {
  captions: string;
  captionStyle: string;
  file: File;
  preset: string;
  prompt: string;
  quality: string;
  trimDuration: number;
  trimStart: number;
  watermark: boolean;
  onEvent: (event: RenderEvent) => void;
};

const outputRoot = join(process.cwd(), ".lumora-motion-renders");
const wingetFfmpegPath = process.env.LOCALAPPDATA
  ? join(
      process.env.LOCALAPPDATA,
      "Microsoft",
      "WinGet",
      "Packages",
      "Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe",
      "ffmpeg-8.1.1-full_build",
      "bin",
      "ffmpeg.exe"
    )
  : "";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9._-]/gi, "_").toLowerCase();
}

function parseProgress(stderr: string, targetDuration: number) {
  const match = /time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/.exec(stderr);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  const elapsed = hours * 3600 + minutes * 60 + seconds;
  return Math.min(96, Math.max(8, Math.round((elapsed / targetDuration) * 100)));
}

function stepForProgress(progress: number) {
  if (progress < 18) return "Analyzing clips";
  if (progress < 30) return "Detecting highlights";
  if (progress < 45) return "Syncing beats";
  if (progress < 60) return "Generating captions";
  if (progress < 76) return "Optimizing pacing";
  if (progress < 90) return "Applying cinematic effects";
  return "Preparing export";
}

function runCommand(command: string, args: string[], onStderr?: (chunk: string) => void, timeoutMs = 120000) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true });
    let stderr = "";
    const timeout = windowlessTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`Render timeout after ${Math.round(timeoutMs / 1000)} seconds.`));
    }, timeoutMs);

    child.stderr.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      stderr += text;
      onStderr?.(text);
    });

    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(stderr || `${command} exited with code ${code}`));
    });
  });
}

function windowlessTimeout(callback: () => void, timeoutMs: number) {
  return setTimeout(callback, timeoutMs);
}

function runCommandWithOutput(command: string, args: string[]) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => reject(error));
    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
        return;
      }

      reject(new Error(stderr || `${command} exited with code ${code}`));
    });
  });
}

function resolveFfmpegCommand() {
  if (process.env.FFMPEG_PATH && existsSync(process.env.FFMPEG_PATH)) {
    return process.env.FFMPEG_PATH;
  }

  if (wingetFfmpegPath && existsSync(wingetFfmpegPath)) {
    return wingetFfmpegPath;
  }

  return "ffmpeg";
}

function resolveFfprobeCommand(ffmpegCommand: string) {
  if (process.env.FFPROBE_PATH && existsSync(process.env.FFPROBE_PATH)) {
    return process.env.FFPROBE_PATH;
  }

  if (ffmpegCommand !== "ffmpeg") {
    const ffprobePath = join(dirname(ffmpegCommand), "ffprobe.exe");
    if (existsSync(ffprobePath)) return ffprobePath;
  }

  return "ffprobe";
}

async function probeVideoDuration(inputPath: string, ffprobeCommand: string) {
  const output = await runCommandWithOutput(ffprobeCommand, [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    inputPath
  ]);
  const duration = Number(output);

  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error("FFprobe could not read a valid duration from the uploaded video.");
  }

  return duration;
}

export async function renderWithFfmpeg({
  captions,
  captionStyle,
  file,
  preset,
  prompt,
  quality,
  trimDuration,
  trimStart,
  watermark,
  onEvent
}: RenderOptions) {
  const jobId = randomUUID();
  const jobDir = join(outputRoot, jobId);
  const inputPath = join(jobDir, sanitizeFileName(file.name || "source.mp4"));
  const captionPath = join(jobDir, "captions.txt");
  const outputPath = join(jobDir, "lumora-motion-render.mp4");
  const logs: string[] = [];

  function log(message: string) {
    logs.push(message);
    onEvent({ type: "log", message });
  }

  await mkdir(jobDir, { recursive: true });
  await writeFile(inputPath, Buffer.from(await file.arrayBuffer()));
  const normalizedCaptions = normalizeCaptions(captions);
  if (normalizedCaptions) {
    await writeFile(captionPath, normalizedCaptions, "utf8");
  }

  log("Upload received by Lumora Motion render worker.");
  log(`Uploaded file saved as ${sanitizeFileName(file.name || "source.mp4")} (${file.size} bytes).`);
  log(`Output folder prepared at ${jobDir}.`);
  log(`Preset engine selected: ${preset}.`);
  log("Beat-sync preparation structure initialized.");
  log("Speed ramp markers prepared for future AI timing.");
  log(
    normalizedCaptions
      ? `Manual captions loaded with ${captionStyle} styling.`
      : "No manual captions supplied; caption overlay skipped."
  );
  onEvent({ type: "progress", progress: 5, step: "Analyzing clips" });
  onEvent({ type: "progress", progress: 14, step: "Detecting highlights" });

  const ffmpegCommand = resolveFfmpegCommand();
  const ffprobeCommand = resolveFfprobeCommand(ffmpegCommand);

  try {
    await runCommand(ffmpegCommand, ["-version"]);
    await runCommand(ffprobeCommand, ["-version"]);
  } catch {
    throw new Error("FFmpeg or FFprobe is not installed or is not available to Lumora Motion.");
  }

  const uploadedDuration = await probeVideoDuration(inputPath, ffprobeCommand);
  const safeTrimStart = Math.min(Math.max(trimStart, 0), Math.max(uploadedDuration - 0.5, 0));
  const remainingDuration = Math.max(uploadedDuration - safeTrimStart, 0.5);
  const safeTrimDuration = Math.min(Math.max(trimDuration, 0.5), remainingDuration);

  log(`Uploaded video duration detected: ${uploadedDuration.toFixed(2)}s.`);
  log(
    `Trim range selected: ${safeTrimStart.toFixed(2)}s start, ${safeTrimDuration.toFixed(2)}s duration.`
  );

  if (safeTrimDuration < trimDuration || safeTrimStart !== trimStart) {
    log("Trim range was clamped to fit inside the uploaded video duration.");
  }

  const renderPlan = buildRenderPlan({
    captionPath: normalizedCaptions ? captionPath : null,
    captionStyle,
    captions: normalizedCaptions,
    preset,
    prompt,
    quality,
    trimDuration: safeTrimDuration,
    watermark
  });
  const audioFilters = [
    `afade=t=in:st=0:d=0.25`,
    `afade=t=out:st=${Math.max(0, safeTrimDuration - 0.35)}:d=0.35`,
    ...renderPlan.audioFilters
  ];
  const args = [
    "-y",
    "-ss",
    String(safeTrimStart),
    "-t",
    String(safeTrimDuration),
    "-i",
    inputPath,
    "-vf",
    renderPlan.graph,
    "-af",
    audioFilters.join(","),
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    quality === "4K Pro" ? "20" : quality === "1080p" ? "24" : "26",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    outputPath
  ];

  log(`FFmpeg render started using ${quality} output settings.`);
  log(`Applying ${preset} style engine: ${renderPlan.description}.`);
  log(watermark ? "Free-plan watermark overlay enabled." : "Watermark overlay disabled for paid demo export.");
  log(`FFmpeg arguments prepared: -ss ${safeTrimStart.toFixed(2)} -t ${safeTrimDuration.toFixed(2)} -vf [Lumora Motion filter graph] -c:v libx264 -c:a aac.`);

  await runCommand(ffmpegCommand, args, (chunk) => {
    const parsed = parseProgress(chunk, safeTrimDuration);
    if (parsed) {
      onEvent({
        type: "progress",
        progress: parsed,
        step: stepForProgress(parsed)
      });
    }
  }, 180000);

  if (!existsSync(outputPath)) {
    throw new Error("FFmpeg finished without creating the Lumora Motion output MP4.");
  }

  const outputStats = await stat(outputPath);
  if (outputStats.size === 0) {
    throw new Error("FFmpeg created an empty Lumora Motion output MP4.");
  }

  log(`Render complete. Output video is ready for download (${outputStats.size} bytes).`);
  onEvent({
    type: "complete",
    outputUrl: `/api/render/${jobId}`,
    jobId,
    logs
  });
}

export function getRenderedOutputPath(jobId: string) {
  return join(outputRoot, jobId, "lumora-motion-render.mp4");
}
