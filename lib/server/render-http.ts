import { renderWithFfmpeg, type RenderEvent } from "@/lib/server/ffmpeg";

function encodeEvent(event: RenderEvent) {
  return `${JSON.stringify(event)}\n`;
}

type LocalRenderOptions = {
  outputBaseUrl?: string;
};

export async function handleLocalRenderRequest(
  request: Request,
  headers: HeadersInit = {},
  options: LocalRenderOptions = {}
) {
  const formData = await request.formData();
  const file = formData.get("video");
  const prompt = String(formData.get("prompt") || "");
  const captions = String(formData.get("captions") || "");
  const captionStyle = String(formData.get("captionStyle") || "tiktok-subtitles");
  const watermark = String(formData.get("watermark") ?? "true") !== "false";
  const preset = String(formData.get("preset") || "Cinematic");
  const quality = String(formData.get("quality") || "1080p");
  const trimDuration = Number(formData.get("trimDuration") || "12");
  const trimStart = Number(formData.get("trimStart") || "0");

  if (!(file instanceof File)) {
    return Response.json({ error: "Missing video file." }, { headers, status: 400 });
  }

  if (!isSupportedVideo(file)) {
    return Response.json(
      { error: "Unsupported video format. Upload an MP4, MOV, or WebM file." },
      { headers, status: 415 }
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const logs: string[] = [];

      function send(event: RenderEvent) {
        if (event.type === "log") logs.push(event.message);
        const normalizedEvent =
          event.type === "complete" && options.outputBaseUrl
            ? {
                ...event,
                outputUrl: `${options.outputBaseUrl.replace(/\/+$/, "")}/render/${event.jobId}`
              }
            : event;

        controller.enqueue(encoder.encode(encodeEvent(normalizedEvent)));
      }

      try {
        await renderWithFfmpeg({
          captionStyle,
          captions,
          file,
          preset,
          prompt,
          quality,
          trimDuration: Number.isFinite(trimDuration) ? Math.min(Math.max(trimDuration, 3), 60) : 12,
          trimStart: Number.isFinite(trimStart) ? Math.max(trimStart, 0) : 0,
          watermark,
          onEvent: send
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Render failed.";
        send({ type: "error", message, logs });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      ...headers,
      "Cache-Control": "no-store",
      "Content-Type": "application/x-ndjson"
    }
  });
}

export function isSupportedVideo(file: File) {
  const name = file.name.toLowerCase();
  return (
    ["video/mp4", "video/quicktime", "video/webm"].includes(file.type) ||
    name.endsWith(".mp4") ||
    name.endsWith(".mov") ||
    name.endsWith(".webm")
  );
}

export async function readRemoteRenderError(response: Response) {
  const fallback = response.statusText || "Render request failed before processing started.";

  try {
    const body = await response.clone().json();
    if (typeof body?.error === "string") return body.error;
    if (typeof body?.message === "string") return body.message;
  } catch {
    // Fall through to text parsing.
  }

  try {
    const text = await response.text();
    return text.trim() || fallback;
  } catch {
    return fallback;
  }
}
