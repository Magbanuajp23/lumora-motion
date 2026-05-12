import { renderWithFfmpeg, type RenderEvent } from "@/lib/server/ffmpeg";

export const runtime = "nodejs";

function encodeEvent(event: RenderEvent) {
  return `${JSON.stringify(event)}\n`;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("video");
  const prompt = String(formData.get("prompt") || "");
  const preset = String(formData.get("preset") || "Cinematic");
  const quality = String(formData.get("quality") || "1080p");
  const trimDuration = Number(formData.get("trimDuration") || "12");
  const trimStart = Number(formData.get("trimStart") || "0");

  if (!(file instanceof File)) {
    return Response.json({ error: "Missing video file." }, { status: 400 });
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
          file,
          preset,
          prompt,
          quality,
          trimDuration: Number.isFinite(trimDuration) ? Math.min(Math.max(trimDuration, 3), 60) : 12,
          trimStart: Number.isFinite(trimStart) ? Math.max(trimStart, 0) : 0,
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
