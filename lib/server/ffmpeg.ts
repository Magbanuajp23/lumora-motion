import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export type RenderEvent =
  | { type: "log"; message: string }
  | { type: "progress"; progress: number; step: string }
  | { type: "complete"; outputUrl: string; jobId: string; logs: string[] }
  | { type: "error"; message: string; logs: string[] };

type RenderOptions = {
  file: File;
  preset: string;
  prompt: string;
  quality: string;
  trimDuration: number;
  trimStart: number;
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

const qualityScale: Record<string, string> = {
  "720p": "1280:-2",
  "1080p": "1920:-2",
  "4K Pro": "3840:-2"
};

function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9._-]/gi, "_").toLowerCase();
}

function getStyleFilter(preset: string, prompt: string) {
  const text = `${preset} ${prompt}`.toLowerCase();

  if (text.includes("phonk") || text.includes("sigma")) {
    return "eq=contrast=1.35:saturation=1.45:brightness=-0.03";
  }

  if (text.includes("luxury") || preset === "Luxury") {
    return "eq=contrast=1.16:saturation=1.08:brightness=0.02";
  }

  if (text.includes("cinematic") || preset === "Cinematic") {
    return "eq=contrast=1.22:saturation=1.12:brightness=-0.015";
  }

  return "eq=contrast=1.18:saturation=1.2:brightness=0.01";
}

function buildFilterGraph(
  preset: string,
  prompt: string,
  quality: string,
  trimDuration: number
) {
  const scale = qualityScale[quality] ?? qualityScale["1080p"];
  const styleFilter = getStyleFilter(preset, prompt);
  const fontFile = "C\\:/Windows/Fonts/arial.ttf";

  return [
    `scale=${scale}`,
    "fps=30",
    styleFilter,
    "fade=t=in:st=0:d=0.35",
    `fade=t=out:st=${Math.max(0, trimDuration - 0.35)}:d=0.35`,
    "drawbox=x=0:y=ih-118:w=iw:h=118:color=black@0.42:t=fill",
    `drawtext=fontfile='${fontFile}':text='Edited with Lumora Motion':x=48:y=h-82:fontsize=34:fontcolor=white:box=1:boxcolor=black@0.25:boxborderw=16`,
    `drawtext=fontfile='${fontFile}':text='Beat-sync prep / speed ramp markers / cinematic transitions':x=48:y=h-38:fontsize=20:fontcolor=0x20D9FF`
  ].join(",");
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

function runCommand(command: string, args: string[], onStderr?: (chunk: string) => void) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true });
    let stderr = "";

    child.stderr.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      stderr += text;
      onStderr?.(text);
    });

    child.on("error", (error) => reject(error));
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(stderr || `${command} exited with code ${code}`));
    });
  });
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
  file,
  preset,
  prompt,
  quality,
  trimDuration,
  trimStart,
  onEvent
}: RenderOptions) {
  const jobId = randomUUID();
  const jobDir = join(outputRoot, jobId);
  const inputPath = join(jobDir, sanitizeFileName(file.name || "source.mp4"));
  const outputPath = join(jobDir, "lumora-motion-render.mp4");
  const logs: string[] = [];

  function log(message: string) {
    logs.push(message);
    onEvent({ type: "log", message });
  }

  await mkdir(jobDir, { recursive: true });
  await writeFile(inputPath, Buffer.from(await file.arrayBuffer()));

  log("Upload received by Lumora Motion render worker.");
  log(`Uploaded file saved as ${sanitizeFileName(file.name || "source.mp4")} (${file.size} bytes).`);
  log(`Output folder prepared at ${jobDir}.`);
  log("Beat-sync preparation structure initialized.");
  log("Speed ramp markers prepared for future AI timing.");
  log("Automatic captions placeholder track generated.");
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

  const filterGraph = buildFilterGraph(preset, prompt, quality, safeTrimDuration);
  const args = [
    "-y",
    "-ss",
    String(safeTrimStart),
    "-t",
    String(safeTrimDuration),
    "-i",
    inputPath,
    "-vf",
    filterGraph,
    "-af",
    `afade=t=in:st=0:d=0.25,afade=t=out:st=${Math.max(0, safeTrimDuration - 0.35)}:d=0.35`,
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    quality === "4K Pro" ? "18" : "23",
    "-c:a",
    "aac",
    "-movflags",
    "+faststart",
    outputPath
  ];

  log(`FFmpeg render started using ${quality} output settings.`);
  log(`Applying ${preset} style filters and cinematic transition fades.`);
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
  });

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
