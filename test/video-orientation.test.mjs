import assert from "node:assert/strict";
import test from "node:test";
import { detectVideoOrientation } from "../lib/video-orientation.js";

test("detects portrait uploaded video metadata", () => {
  assert.equal(detectVideoOrientation(720, 1280), "portrait");
  assert.equal(detectVideoOrientation(1080, 1920), "portrait");
});

test("detects landscape uploaded video metadata", () => {
  assert.equal(detectVideoOrientation(1280, 720), "landscape");
  assert.equal(detectVideoOrientation(1920, 1080), "landscape");
});

test("detects square uploaded video metadata", () => {
  assert.equal(detectVideoOrientation(1080, 1080), "square");
});

test("returns unknown when metadata is unavailable", () => {
  assert.equal(detectVideoOrientation(0, 1080), "unknown");
  assert.equal(detectVideoOrientation(Number.NaN, 1080), "unknown");
});
