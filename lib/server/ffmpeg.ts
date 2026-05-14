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

type PresetEngineConfig = {
  audioFilters: string[];
  captionY: string;
  colorFilters: string[];
  description: string;
  introText: string;
  motionFilters: string[];
  outroText: string;
  titleFontColor: string;
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

const stylePresets: Record<string, PresetEngineConfig> = {
  Cinematic: {
    audioFilters: [],
    captionY: "h-178",
    colorFilters: [
      "eq=contrast=1.2:saturation=1.12:brightness=-0.018",
      "unsharp=5:5:0.45:3:3:0.2",
      "vignette=PI/5"
    ],
    description: "color grade, slight contrast, slow zoom, fade transitions",
    introText: "CINEMATIC CUT",
    motionFilters: ["scale=trunc(iw*1.025/2)*2:trunc(ih*1.025/2)*2", "crop=trunc(iw/1.025/2)*2:trunc(ih/1.025/2)*2", "scale=iw:-2"],
    outroText: "MADE WITH AI",
    titleFontColor: "white"
  },
  "Viral TikTok": {
    audioFilters: ["acompressor=threshold=-18dB:ratio=2.5:attack=12:release=120"],
    captionY: "h-220",
    colorFilters: [
      "eq=contrast=1.34:saturation=1.34:brightness=0.015",
      "unsharp=7:7:0.75:5:5:0.35"
    ],
    description: "fast cuts, beat-style pacing, punchy contrast, creator captions",
    introText: "WAIT FOR IT",
    motionFilters: ["crop=iw-24:ih-24:12+8*sin(18*t):12+6*cos(14*t)", "scale=iw:-2"],
    outroText: "FOLLOW FOR MORE",
    titleFontColor: "0x20D9FF"
  },
  "Real Estate": {
    audioFilters: [],
    captionY: "h-152",
    colorFilters: [
      "eq=contrast=1.08:saturation=1.1:brightness=0.04",
      "unsharp=5:5:0.35:3:3:0.16"
    ],
    description: "smooth pans, luxury color tone, elegant text overlays",
    introText: "SIGNATURE TOUR",
    motionFilters: ["scale=trunc(iw*1.018/2)*2:trunc(ih*1.018/2)*2", "crop=trunc(iw/1.018/2)*2:trunc(ih/1.018/2)*2", "scale=iw:-2"],
    outroText: "PRIVATE SHOWING",
    titleFontColor: "0x7CFFC4"
  },
  "Gaming Montage": {
    audioFilters: ["acompressor=threshold=-20dB:ratio=3:attack=8:release=90"],
    captionY: "h-190",
    colorFilters: [
      "eq=contrast=1.38:saturation=1.48:brightness=-0.02",
      "unsharp=7:7:0.9:5:5:0.45"
    ],
    description: "fast zooms, shake effects, impact cuts, phonk-style energy",
    introText: "IMPACT SYNC",
    motionFilters: ["crop=iw-36:ih-36:18+14*sin(24*t):18+10*cos(18*t)", "scale=iw:-2", "rotate=0.005*sin(22*t):fillcolor=black"],
    outroText: "CLUTCH MOMENT",
    titleFontColor: "0xB75CFF"
  },
  Motivational: {
    audioFilters: ["acompressor=threshold=-18dB:ratio=2:attack=10:release=140"],
    captionY: "h-205",
    colorFilters: [
      "eq=contrast=1.22:saturation=1.2:brightness=0.02",
      "colorbalance=rs=.03:gs=.01:bs=-.02",
      "vignette=PI/6"
    ],
    description: "bold captions, dramatic pacing, warm color grade",
    introText: "LOCK IN",
    motionFilters: ["scale=trunc(iw*1.02/2)*2:trunc(ih*1.02/2)*2", "crop=trunc(iw/1.02/2)*2:trunc(ih/1.02/2)*2", "scale=iw:-2"],
    outroText: "KEEP GOING",
    titleFontColor: "0xFFE66D"
  },
  Luxury: {
    audioFilters: [],
    captionY: "h-160",
    colorFilters: [
      "eq=contrast=1.12:saturation=1.04:brightness=0.025",
      "colorbalance=rs=.015:gs=.01:bs=.005",
      "vignette=PI/7"
    ],
    description: "clean slow-motion feel, soft contrast, premium text style",
    introText: "LUMORA SELECT",
    motionFilters: ["scale=trunc(iw*1.015/2)*2:trunc(ih*1.015/2)*2", "crop=trunc(iw/1.015/2)*2:trunc(ih/1.015/2)*2", "scale=iw:-2"],
    outroText: "PREMIUM CUT",
    titleFontColor: "white"
  }
};

function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9._-]/gi, "_").toLowerCase();
}

function buildFilterGraph(
  captionPath: string | null,
  captionStyle: string,
  captions: string,
  preset: string,
  prompt: string,
  quality: string,
  trimDuration: number,
  watermark: boolean
) {
  const scale = qualityScale[quality] ?? qualityScale["1080p"];
  const presetConfig = resolvePresetConfig(preset, prompt);
  const fontFile = getFontFile(captionStyle);
  const introText = escapeDrawtextText(presetConfig.introText);
  const outroText = escapeDrawtextText(presetConfig.outroText);
  const filters = [
    `scale=${scale}`,
    "fps=30",
    ...presetConfig.motionFilters,
    ...presetConfig.colorFilters,
    "format=yuv420p",
    "fade=t=in:st=0:d=0.28",
    `fade=t=out:st=${Math.max(0, trimDuration - 0.35)}:d=0.35`,
    `drawtext=fontfile='${fontFile}':text='${introText}':x=48:y=46:fontsize=38:fontcolor=${presetConfig.titleFontColor}:box=1:boxcolor=black@0.36:boxborderw=18:enable='between(t,0,1.8)'`,
    `drawtext=fontfile='${fontFile}':text='${outroText}':x=w-tw-48:y=46:fontsize=30:fontcolor=white:box=1:boxcolor=black@0.28:boxborderw=14:enable='between(t,${Math.max(0, trimDuration - 2).toFixed(2)},${trimDuration.toFixed(2)})'`
  ];

  if (captionPath && captions.trim()) {
    filters.push(...buildCaptionFilters(captionPath, captionStyle, fontFile, presetConfig.captionY));
  }

  if (watermark) {
    filters.push(
      "drawbox=x=0:y=ih-92:w=iw:h=92:color=black@0.34:t=fill",
      `drawtext=fontfile='${fontFile}':text='Edited with Lumora Motion':x=48:y=h-60:fontsize=24:fontcolor=white:box=1:boxcolor=black@0.18:boxborderw=10`
    );
  }

  return {
    audioFilters: presetConfig.audioFilters,
    description: presetConfig.description,
    graph: filters.join(",")
  };
}

function resolvePresetConfig(preset: string, prompt: string) {
  const promptText = prompt.toLowerCase();

  if (stylePresets[preset]) return stylePresets[preset];
  if (promptText.includes("gaming") || promptText.includes("phonk")) {
    return stylePresets["Gaming Montage"];
  }
  if (promptText.includes("real estate") || promptText.includes("listing")) {
    return stylePresets["Real Estate"];
  }
  if (promptText.includes("luxury") || promptText.includes("premium")) {
    return stylePresets.Luxury;
  }
  if (promptText.includes("motivational") || promptText.includes("hormozi")) {
    return stylePresets.Motivational;
  }
  if (promptText.includes("tiktok") || promptText.includes("viral")) {
    return stylePresets["Viral TikTok"];
  }

  return stylePresets.Cinematic;
}

function buildCaptionFilters(
  captionPath: string,
  captionStyle: string,
  fontFile: string,
  defaultY: string
) {
  const textFile = toFfmpegPath(captionPath);
  const base = `fontfile='${fontFile}':textfile='${textFile}':x=(w-tw)/2`;

  if (captionStyle === "yellow-highlight") {
    return [
      `drawtext=${base}:y=${defaultY}:fontsize=48:fontcolor=0xFFE66D:box=1:boxcolor=black@0.62:boxborderw=22:line_spacing=10`
    ];
  }

  if (captionStyle === "luxury-serif") {
    return [
      `drawtext=${base}:y=${defaultY}:fontsize=42:fontcolor=white:box=1:boxcolor=black@0.34:boxborderw=20:line_spacing=12`
    ];
  }

  if (captionStyle === "tiktok-subtitles") {
    return [
      `drawtext=${base}:y=h-240:fontsize=54:fontcolor=white:borderw=4:bordercolor=black@0.85:box=1:boxcolor=0x20D9FF@0.16:boxborderw=18:line_spacing=8`
    ];
  }

  return [
    `drawtext=${base}:y=${defaultY}:fontsize=46:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=20:line_spacing=10`
  ];
}

function getFontFile(captionStyle: string) {
  if (process.platform === "win32") {
    const fontName = captionStyle === "luxury-serif" ? "georgia.ttf" : "arial.ttf";
    return `C\\:/Windows/Fonts/${fontName}`;
  }

  const candidates = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/Library/Fonts/Arial.ttf"
  ];

  const font = candidates.find((candidate) => existsSync(candidate));
  return font ? toFfmpegPath(font) : "";
}

function toFfmpegPath(path: string) {
  return path.replace(/\\/g, "/").replace(/:/g, "\\:");
}

function escapeDrawtextText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/:/g, "\\:").replace(/%/g, "\\%");
}

function normalizeCaptions(captions: string) {
  return captions
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join("\n");
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

  const renderPlan = buildFilterGraph(
    normalizedCaptions ? captionPath : null,
    captionStyle,
    normalizedCaptions,
    preset,
    prompt,
    quality,
    safeTrimDuration,
    watermark
  );
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
