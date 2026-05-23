const defaultAllowedOrigins = [
  "http://localhost:3000",
  "https://lumora-motion.vercel.app"
];

function getAllowedOrigins() {
  const configured = process.env.LUMORA_ALLOWED_ORIGINS;

  if (!configured) return defaultAllowedOrigins;

  return configured
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function getCorsHeaders(request: Request) {
  const requestOrigin = request.headers.get("origin") || "";
  const allowedOrigins = getAllowedOrigins();
  const allowAny = allowedOrigins.includes("*");
  const allowOrigin =
    allowAny || !requestOrigin || allowedOrigins.includes(requestOrigin)
      ? requestOrigin || "*"
      : allowedOrigins[0];

  return {
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}

export function createCorsPreflight(request: Request) {
  return new Response(null, {
    headers: getCorsHeaders(request),
    status: 204
  });
}
