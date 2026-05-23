import { readFile } from "node:fs/promises";
import { createCorsPreflight, getCorsHeaders } from "@/lib/server/cors";
import { getRenderedOutputPath } from "@/lib/server/ffmpeg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(request: Request) {
  return createCorsPreflight(request);
}

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  const jobId = params.jobId.replace(/[^a-z0-9-]/gi, "");

  try {
    const bytes = await readFile(getRenderedOutputPath(jobId));
    return new Response(bytes, {
      headers: {
        ...getCorsHeaders(request),
        "Cache-Control": "no-store",
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
