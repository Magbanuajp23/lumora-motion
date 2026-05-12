import { readFile } from "node:fs/promises";
import { getRenderedOutputPath } from "@/lib/server/ffmpeg";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { jobId: string } }
) {
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
