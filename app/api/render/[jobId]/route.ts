import { readFile } from "node:fs/promises";
import { getRenderedOutputPath } from "@/lib/server/ffmpeg";
import {
  getRenderBackendConfig,
  PRODUCTION_RENDER_UNAVAILABLE_MESSAGE
} from "@/lib/server/render-config";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
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
      { status: 503 }
    );
  }

  const jobId = params.jobId.replace(/[^a-z0-9-]/gi, "");

  try {
    const bytes = await readFile(getRenderedOutputPath(jobId));
    return new Response(bytes, {
      headers: {
        "Content-Disposition": `attachment; filename="lumora-motion-render-${jobId}.mp4"`,
        "Content-Type": "video/mp4"
      }
    });
  } catch {
    return Response.json({ error: "Rendered video not found." }, { status: 404 });
  }
}
