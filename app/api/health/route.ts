import { createCorsPreflight, getCorsHeaders } from "@/lib/server/cors";
import { getFfmpegHealth } from "@/lib/server/ffmpeg";
import { getRenderBackendConfig } from "@/lib/server/render-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(request: Request) {
  return createCorsPreflight(request);
}

export async function GET(request: Request) {
  const renderBackend = getRenderBackendConfig();
  const ffmpeg = await getFfmpegHealth();
  const healthy = renderBackend.mode !== "disabled" && (renderBackend.mode === "remote" || ffmpeg.available);

  return Response.json(
    {
      ffmpeg,
      ok: healthy,
      renderBackend,
      service: "lumora-motion-render",
      timestamp: new Date().toISOString()
    },
    {
      headers: {
        ...getCorsHeaders(request),
        "Cache-Control": "no-store"
      },
      status: healthy ? 200 : 503
    }
  );
}
