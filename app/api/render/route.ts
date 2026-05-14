import { renderWithFfmpeg, type RenderEvent } from "@/lib/server/ffmpeg";
import {
  getRenderBackendConfig,
  PRODUCTION_RENDER_UNAVAILABLE_MESSAGE
} from "@/lib/server/render-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function encodeEvent(event: RenderEvent) {
  return `${JSON.stringify(event)}\n`;
}

export async function POST(request: Request) {
  const backend = getRenderBackendConfig();

  if (backend.mode === "disabled") {
    return Response.json(
      {
        code: "RENDER_BACKEND_REQUIRED",
        detail: backend.detail,
        error: PRODUCTION_RENDER_UNAVAILABLE_MESSAGE
      },
      { status: 503 }
    );
  }

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
    return Response.json({ error: "Missing video file." }, { status: 400 });
  }

  if (!isSupportedVideo(file)) {
    return Response.json(
      { error: "Unsupported video format. Upload an MP4, MOV, or WebM file." },
      { status: 415 }
    );
  }

  if (backend.mode === "remote") {
    const response = await fetch(`${backend.remoteRenderUrl}/render`, {
      body: formData,
      method: "POST"
    });

    if (!response.ok || !response.body) {
      const message = await readErrorMessage(response);
      return Response.json(
        {
          code: "REMOTE_RENDER_FAILED",
          detail:
            "The configured render backend did not accept the job. Check the backend logs and LUMORA_RENDER_BACKEND_URL.",
          error: message
        },
        { status: response.status || 502 }
      );
    }

    return new Response(response.body, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": response.headers.get("Content-Type") || "application/x-ndjson"
      },
      status: response.status
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const logs: string[] = [];

      function send(event: RenderEvent) {
        if (event.type === "log") logs.push(event.message);
        controller.enqueue(encoder.encode(encodeEvent(event)));
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
      "Cache-Control": "no-store",
      "Content-Type": "application/x-ndjson"
    }
  });
}

function isSupportedVideo(file: File) {
  const name = file.name.toLowerCase();
  return (
    ["video/mp4", "video/quicktime", "video/webm"].includes(file.type) ||
    name.endsWith(".mp4") ||
    name.endsWith(".mov") ||
    name.endsWith(".webm")
  );
}

async function readErrorMessage(response: Response) {
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
