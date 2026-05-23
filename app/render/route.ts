import { createCorsPreflight, getCorsHeaders } from "@/lib/server/cors";
import { handleLocalRenderRequest } from "@/lib/server/render-http";

const defaultProductionRenderUrl = "https://lumora-motion-production.up.railway.app";

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

  const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN?.trim();
  if (railwayDomain) return `https://${railwayDomain.replace(/^https?:\/\//, "")}`;

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (forwardedHost && !isLocalHost(forwardedHost)) {
    return `${forwardedProto || "https"}://${forwardedHost}`;
  }

  const url = new URL(request.url);
  if (isLocalHost(url.host) && process.env.NODE_ENV === "production") {
    return defaultProductionRenderUrl;
  }

  return `${url.protocol}//${url.host}`;
}

function isLocalHost(host: string) {
  return /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(host);
}
