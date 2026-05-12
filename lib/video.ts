export const allowedVideoTypes = ["video/mp4", "video/quicktime", "video/webm"];
export const allowedVideoExtensions = [".mp4", ".mov", ".webm"];

export function formatDuration(seconds: number | null) {
  if (!seconds || !Number.isFinite(seconds)) return "--:--";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function formatFileSize(bytes: number) {
  if (!bytes) return "0 MB";
  const megabytes = bytes / 1024 / 1024;
  return `${megabytes.toFixed(megabytes > 100 ? 0 : 1)} MB`;
}

export function isAllowedVideoFile(file: File) {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return (
    allowedVideoTypes.includes(file.type) ||
    allowedVideoExtensions.includes(extension)
  );
}
