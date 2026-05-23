import {
  getRenderBackendConfig,
  PRODUCTION_RENDER_UNAVAILABLE_MESSAGE
} from "@/lib/server/render-config";
import { handleLocalRenderRequest, readRemoteRenderError } from "@/lib/server/render-http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

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

  if (backend.mode === "remote") {
    const formData = await request.formData();

    const response = await fetch(`${backend.remoteRenderUrl}/render`, {
      body: formData,
      headers: {
        "X-Lumora-Frontend": "vercel"
      },
      method: "POST"
    });

    if (!response.ok || !response.body) {
      const message = await readRemoteRenderError(response);
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

  return handleLocalRenderRequest(request);
}
