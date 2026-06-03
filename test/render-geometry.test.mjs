import assert from "node:assert/strict";
import test from "node:test";
import {
  detectOrientation,
  getBetaOutputBounds
} from "../lib/server/render-geometry.js";

test("portrait uploads stay portrait and cap to 720x1280", () => {
  const source = { width: 720, height: 1280, rotation: 0 };
  const bounds = getBetaOutputBounds(source);

  assert.equal(detectOrientation(source), "portrait");
  assert.equal(bounds.orientation, "portrait");
  assert.equal(bounds.width, 720);
  assert.equal(bounds.height, 1280);
  assert.equal(bounds.aspectRatio, "9:16");
});

test("landscape uploads stay landscape and cap to 1280x720", () => {
  const source = { width: 1920, height: 1080, rotation: 0 };
  const bounds = getBetaOutputBounds(source);

  assert.equal(detectOrientation(source), "landscape");
  assert.equal(bounds.orientation, "landscape");
  assert.equal(bounds.width, 1280);
  assert.equal(bounds.height, 720);
  assert.equal(bounds.aspectRatio, "16:9");
});

test("square uploads stay square and cap to 720x720", () => {
  const source = { width: 1000, height: 1000, rotation: 0 };
  const bounds = getBetaOutputBounds(source);

  assert.equal(detectOrientation(source), "square");
  assert.equal(bounds.orientation, "square");
  assert.equal(bounds.width, 720);
  assert.equal(bounds.height, 720);
  assert.equal(bounds.aspectRatio, "1:1");
});

test("rotated portrait metadata is detected as portrait", () => {
  const source = { width: 1920, height: 1080, rotation: 90 };
  const bounds = getBetaOutputBounds(source);

  assert.equal(detectOrientation(source), "portrait");
  assert.equal(bounds.orientation, "portrait");
  assert.equal(bounds.displayWidth, 1080);
  assert.equal(bounds.displayHeight, 1920);
  assert.equal(bounds.width, 720);
  assert.equal(bounds.height, 1280);
});
