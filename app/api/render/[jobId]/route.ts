import { readFile } from "node:fs/promises";
import { createCorsPreflight, getCorsHeaders } from "@/lib/server/cors";
import { getRenderedOutputPath } from "@/lib/server/ffmpeg";
import {
  getRenderBackendConfig,
  PRODUCTION_RENDER_UNAVAILABLE_MESSAGE
} from "@/lib/server/render-config";

export const runtime = "nodejs";

export function OPTIONS(request: Request) {
  return createCorsPreflight(request);
}

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  const backend = getRenderBackendConfig();

  if (backend.mode === "disabled") {
    return Response.json(
      {
        code: "RENDER_BACKEND_REQUIRED",
        detail: backend.detail,
        error: PRODUCTION_RENDER_UNAVAILABLE_MESSAGE
      },
      { headers: getCorsHeaders(request), status: 503 }
    );
  }

  const jobId = params.jobId.replace(/[^a-z0-9-]/gi, "");

  if (backend.mode === "remote") {
    const response = await fetch(`${backend.remoteRenderUrl}/api/render/${jobId}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return Response.json(
        {
          code: "REMOTE_EXPORT_NOT_FOUND",
          detail:
            "The render finished on a remote backend, but Vercel could not retrieve the exported MP4 from that backend.",
          error: response.statusText || "Rendered video not found on remote backend."
        },
        { headers: getCorsHeaders(request), status: response.status || 502 }
      );
    }

    return new Response(response.body, {
      headers: {
        ...getCorsHeaders(request),
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="lumora-motion-render-${jobId}.mp4"`,
        "Content-Type": response.headers.get("Content-Type") || "video/mp4"
      },
      status: response.status
    });
  }

  try {
    const bytes = await readFile(getRenderedOutputPath(jobId));
    return new Response(bytes, {
      headers: {
        ...getCorsHeaders(request),
        "Content-Disposition": `attachment; filename="lumora-motion-render-${jobId}.mp4"`,
        "Content-Type": "video/mp4"
      }
    });
  } catch {
    return Response.json(
      { error: "Rendered video not found." },
      { headers: getCorsHeaders(request), status: 404 }
    );
  }
}
