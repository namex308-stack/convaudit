import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateEarnings,
  CPM_RANGES,
  CREATOR_SHARE,
  YOUTUBE_NICHES,
} from "../src/lib/youtube-earnings.ts";

test("calculates matching low, likely, and high RPM and earnings", () => {
  const tech = YOUTUBE_NICHES.find((niche) => niche.niche === "Tech / Software");
  assert.ok(tech);

  const earnings = calculateEarnings(100_000, tech);

  assert.equal(CREATOR_SHARE, 0.55);
  assert.deepEqual(CPM_RANGES["Tech / Software"], { low: 8, high: 20 });
  assert.deepEqual(earnings.rpm, { low: 4.4, mid: 7.7, high: 11 });
  assert.deepEqual(earnings.monthly, { low: 440, mid: 770, high: 1100 });
  assert.deepEqual(earnings.annual, { low: 5280, mid: 9240, high: 13200 });
});
