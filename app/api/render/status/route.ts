import { getRenderBackendConfig } from "@/lib/server/render-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const config = getRenderBackendConfig();
  const remoteHealth =
    config.mode === "remote" ? await getRemoteHealth(config.remoteRenderUrl) : null;

  return Response.json(
    {
      directRenderUrl: config.mode === "remote" ? `${config.remoteRenderUrl}/render` : null,
      detail: config.detail,
      maxUploadBytes: config.maxUploadBytes,
      message: config.message,
      mode: config.mode,
      remoteHealth
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}

async function getRemoteHealth(remoteRenderUrl: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`${remoteRenderUrl}/api/health`, {
      cache: "no-store",
      signal: controller.signal
    });
    clearTimeout(timeout);

    return {
      ok: response.ok,
      status: response.status,
      url: `${remoteRenderUrl}/api/health`
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Remote health check failed.",
      ok: false,
      url: `${remoteRenderUrl}/api/health`
    };
  }
}
