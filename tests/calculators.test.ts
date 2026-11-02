import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateEngagementRate,
  calculateTikTokEarnings,
} from "../src/lib/calculators.ts";

test("calculates engagement rate from likes, comments, and shares", () => {
  assert.equal(calculateEngagementRate(1000, 50, 5, 2), 5.7);
});

test("returns zero engagement rate when there are no followers", () => {
  assert.equal(calculateEngagementRate(0, 50, 5, 2), 0);
});

test("calculates TikTok earnings from views and RPM", () => {
  assert.equal(calculateTikTokEarnings(100_000, 0.5), 50);
});

test("calculates fractional-thousand TikTok views", () => {
  assert.equal(calculateTikTokEarnings(1_250, 2.4), 3);
});
