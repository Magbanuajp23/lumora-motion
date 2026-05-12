export const PRODUCTION_RENDER_UNAVAILABLE_MESSAGE =
  "Online video rendering is not available yet. Please run locally or connect a render backend.";

const rawRemoteRenderUrl = process.env.LUMORA_RENDER_BACKEND_URL?.trim();

export type RenderBackendMode = "local" | "remote" | "disabled";

export function getRenderBackendConfig() {
  const remoteRenderUrl = rawRemoteRenderUrl
    ? rawRemoteRenderUrl.replace(/\/+$/, "")
    : "";
  const isVercel = process.env.VERCEL === "1";
  const forceDisableLocalRender = process.env.DISABLE_LOCAL_RENDER === "1";

  if (remoteRenderUrl) {
    return {
      detail:
        "A remote render backend is configured. Lumora Motion will forward render jobs to that service.",
      isVercel,
      maxUploadBytes: 4.5 * 1024 * 1024,
      message: "Remote Lumora Motion rendering is available.",
      mode: "remote" as RenderBackendMode,
      remoteRenderUrl
    };
  }

  if (isVercel || forceDisableLocalRender) {
    return {
      detail:
        "This deployment cannot run the bundled local FFmpeg render worker. Use localhost for the MVP pipeline, or set LUMORA_RENDER_BACKEND_URL to a dedicated render service on Railway, Render, RunPod, or similar infrastructure.",
      isVercel,
      maxUploadBytes: 4.5 * 1024 * 1024,
      message: PRODUCTION_RENDER_UNAVAILABLE_MESSAGE,
      mode: "disabled" as RenderBackendMode,
      remoteRenderUrl: ""
    };
  }

  return {
    detail:
      "Local FFmpeg rendering is enabled. Rendered files are written to the local .lumora-motion-renders folder.",
    isVercel,
    maxUploadBytes: 250 * 1024 * 1024,
    message: "Local Lumora Motion rendering is available.",
    mode: "local" as RenderBackendMode,
    remoteRenderUrl: ""
  };
}
