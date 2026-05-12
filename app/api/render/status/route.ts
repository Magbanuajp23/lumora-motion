import { getRenderBackendConfig } from "@/lib/server/render-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const config = getRenderBackendConfig();

  return Response.json(
    {
      detail: config.detail,
      maxUploadBytes: config.maxUploadBytes,
      message: config.message,
      mode: config.mode
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
