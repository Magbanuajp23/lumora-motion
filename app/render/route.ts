import { createCorsPreflight, getCorsHeaders } from "@/lib/server/cors";
import { handleLocalRenderRequest } from "@/lib/server/render-http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export function OPTIONS(request: Request) {
  return createCorsPreflight(request);
}

export async function POST(request: Request) {
  if (process.env.DISABLE_LOCAL_RENDER === "1") {
    return Response.json(
      {
        code: "RENDER_DISABLED",
        error: "This Lumora Motion render backend has local FFmpeg rendering disabled."
      },
      { headers: getCorsHeaders(request), status: 503 }
    );
  }

  return handleLocalRenderRequest(request, getCorsHeaders(request), {
    outputBaseUrl: getPublicRenderBaseUrl(request)
  });
}

function getPublicRenderBaseUrl(request: Request) {
  const configured = process.env.LUMORA_PUBLIC_RENDER_URL?.trim();
  if (configured) return configured;

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}
