const BETA_OUTPUT_CAPS = {
  landscape: { width: 1280, height: 720 },
  portrait: { width: 720, height: 1280 },
  square: { width: 720, height: 720 }
};

function normalizeRotation(rotation = 0) {
  const normalized = ((Math.round(Number(rotation) || 0) % 360) + 360) % 360;
  return normalized;
}

function getDisplayDimensions(source) {
  const rotation = normalizeRotation(source.rotation);
  const shouldSwap = rotation === 90 || rotation === 270;

  return {
    height: shouldSwap ? source.width : source.height,
    rotation,
    width: shouldSwap ? source.height : source.width
  };
}

function detectOrientation(source) {
  const display = getDisplayDimensions(source);
  if (display.width === display.height) return "square";
  return display.width > display.height ? "landscape" : "portrait";
}

function toEvenDimension(value) {
  return Math.max(2, Math.floor(value / 2) * 2);
}

function getAspectRatioLabel(dimensions) {
  const divisor = greatestCommonDivisor(dimensions.width, dimensions.height);
  return `${dimensions.width / divisor}:${dimensions.height / divisor}`;
}

function getBetaOutputBounds(source) {
  const display = getDisplayDimensions(source);
  const orientation = detectOrientation(source);
  const cap = BETA_OUTPUT_CAPS[orientation];
  const scale = Math.min(1, cap.width / display.width, cap.height / display.height);

  return {
    aspectRatio: getAspectRatioLabel(display),
    displayHeight: display.height,
    displayWidth: display.width,
    height: toEvenDimension(display.height * scale),
    orientation,
    rotation: display.rotation,
    width: toEvenDimension(display.width * scale)
  };
}

function buildAspectPreservingScaleFilter(bounds) {
  return [
    `scale='min(iw,${bounds.width})':'min(ih,${bounds.height})':force_original_aspect_ratio=decrease`,
    "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "setsar=1"
  ].join(",");
}

function greatestCommonDivisor(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y) {
    const next = y;
    y = x % y;
    x = next;
  }

  return x || 1;
}

module.exports = {
  BETA_OUTPUT_CAPS,
  buildAspectPreservingScaleFilter,
  detectOrientation,
  getAspectRatioLabel,
  getBetaOutputBounds,
  getDisplayDimensions,
  normalizeRotation
};
