const VIDEO_ORIENTATION_ASPECT = {
  landscape: "16:9",
  portrait: "9:16",
  square: "1:1",
  unknown: "auto"
};

function detectVideoOrientation(width, height) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return "unknown";
  }

  if (width === height) return "square";
  return width > height ? "landscape" : "portrait";
}

module.exports = {
  VIDEO_ORIENTATION_ASPECT,
  detectVideoOrientation
};
