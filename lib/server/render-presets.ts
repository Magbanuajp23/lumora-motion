import { existsSync } from "node:fs";

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
    motionFilters: [
      "scale=trunc(iw*1.025/2)*2:trunc(ih*1.025/2)*2",
      "crop=trunc(iw/1.025/2)*2:trunc(ih/1.025/2)*2",
      "scale=iw:-2"
    ],
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
    motionFilters: [
      "scale=trunc(iw*1.018/2)*2:trunc(ih*1.018/2)*2",
      "crop=trunc(iw/1.018/2)*2:trunc(ih/1.018/2)*2",
      "scale=iw:-2"
    ],
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
    motionFilters: [
      "crop=iw-36:ih-36:18+14*sin(24*t):18+10*cos(18*t)",
      "scale=iw:-2",
      "rotate=0.005*sin(22*t):fillcolor=black"
    ],
    outroText: "CLUTCH MOMENT",
    titleFontColor: "0xB75CFF"
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
    motionFilters: [
      "scale=trunc(iw*1.015/2)*2:trunc(ih*1.015/2)*2",
      "crop=trunc(iw/1.015/2)*2:trunc(ih/1.015/2)*2",
      "scale=iw:-2"
    ],
    outroText: "PREMIUM CUT",
    titleFontColor: "white"
  }
};

export function normalizeCaptions(captions: string) {
  return captions
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join("\n");
}

export function buildRenderPlan({
  captionPath,
  captionStyle,
  captions,
  preset,
  prompt,
  quality,
  trimDuration,
  watermark
}: {
  captionPath: string | null;
  captionStyle: string;
  captions: string;
  preset: string;
  prompt: string;
  quality: string;
  trimDuration: number;
  watermark: boolean;
}) {
  const scale = qualityScale[quality] ?? qualityScale["1080p"];
  const presetConfig = resolvePresetConfig(preset, prompt);
  const fontFile = getFontFile(captionStyle);
  const filters = [
    `scale=${scale}`,
    "fps=30",
    ...presetConfig.motionFilters,
    ...presetConfig.colorFilters,
    "format=yuv420p",
    "fade=t=in:st=0:d=0.28",
    `fade=t=out:st=${Math.max(0, trimDuration - 0.35)}:d=0.35`,
    `drawtext=fontfile='${fontFile}':text='${escapeDrawtextText(presetConfig.introText)}':x=48:y=46:fontsize=38:fontcolor=${presetConfig.titleFontColor}:box=1:boxcolor=black@0.36:boxborderw=18:enable='between(t,0,1.8)'`,
    `drawtext=fontfile='${fontFile}':text='${escapeDrawtextText(presetConfig.outroText)}':x=w-tw-48:y=46:fontsize=30:fontcolor=white:box=1:boxcolor=black@0.28:boxborderw=14:enable='between(t,${Math.max(0, trimDuration - 2).toFixed(2)},${trimDuration.toFixed(2)})'`
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
  if (promptText.includes("gaming") || promptText.includes("phonk")) return stylePresets["Gaming Montage"];
  if (promptText.includes("real estate") || promptText.includes("listing")) return stylePresets["Real Estate"];
  if (promptText.includes("luxury") || promptText.includes("premium")) return stylePresets.Luxury;
  if (promptText.includes("tiktok") || promptText.includes("viral")) return stylePresets["Viral TikTok"];

  return stylePresets.Cinematic;
}

function buildCaptionFilters(captionPath: string, captionStyle: string, fontFile: string, defaultY: string) {
  const textFile = toFfmpegPath(captionPath);
  const base = `fontfile='${fontFile}':textfile='${textFile}':x=(w-tw)/2`;

  if (captionStyle === "yellow-highlight") {
    return [`drawtext=${base}:y=${defaultY}:fontsize=48:fontcolor=0xFFE66D:box=1:boxcolor=black@0.62:boxborderw=22:line_spacing=10`];
  }

  if (captionStyle === "luxury-serif") {
    return [`drawtext=${base}:y=${defaultY}:fontsize=42:fontcolor=white:box=1:boxcolor=black@0.34:boxborderw=20:line_spacing=12`];
  }

  if (captionStyle === "tiktok-subtitles") {
    return [`drawtext=${base}:y=h-240:fontsize=54:fontcolor=white:borderw=4:bordercolor=black@0.85:box=1:boxcolor=0x20D9FF@0.16:boxborderw=18:line_spacing=8`];
  }

  return [`drawtext=${base}:y=${defaultY}:fontsize=46:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=20:line_spacing=10`];
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
