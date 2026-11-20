"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculateEngagementRate,
  ENGAGEMENT_RATE_BENCHMARKS,
} from "@/lib/calculators";

const fields = [
  { key: "followers", label: "Followers" },
  { key: "likes", label: "Likes" },
  { key: "comments", label: "Comments" },
  { key: "shares", label: "Shares" },
] as const;

type FieldKey = (typeof fields)[number]["key"];
type Counts = Record<FieldKey, string>;

function countValue(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

export function EngagementRateCalculator() {
  const [counts, setCounts] = useState<Counts>({
    followers: "1000",
    likes: "50",
    comments: "5",
    shares: "2",
  });

  const followers = countValue(counts.followers);
  const interactions =
    countValue(counts.likes) +
    countValue(counts.comments) +
    countValue(counts.shares);
  const engagementRate = calculateEngagementRate(
    followers,
    countValue(counts.likes),
    countValue(counts.comments),
    countValue(counts.shares),
  );

  return (
    <div className="space-y-6">
      <section
        aria-label="Engagement rate inputs"
        className="rounded-xl border bg-card p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={`engagement-${key}`}>{label}</Label>
              <Input
                id={`engagement-${key}`}
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={counts[key]}
                onChange={(event) =>
                  setCounts((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
              />
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Enter the counts for a single post. A follower count above zero is
          required to calculate a meaningful rate.
        </p>
      </section>

      <section
        aria-live="polite"
        aria-label="Engagement rate result"
        className="rounded-xl bg-foreground p-6 text-background"
      >
        <p className="text-sm font-medium opacity-75">Engagement rate</p>
        <p className="mt-1 text-4xl font-bold tracking-tight">
          {engagementRate.toFixed(2)}%
        </p>
        <p className="mt-2 text-sm opacity-75">
          {followers > 0
            ? `${String(interactions)} total interactions ÷ ${String(followers)} followers`
            : "Enter a follower count above zero to calculate your rate."}
        </p>
      </section>

      <section aria-labelledby="benchmarks-title" className="space-y-3">
        <div>
          <h3 id="benchmarks-title" className="text-lg font-semibold">
            Platform benchmarks
          </h3>
          <p className="text-sm text-muted-foreground">
            Broad reference ranges; actual results vary by audience, content,
            and measurement method.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {ENGAGEMENT_RATE_BENCHMARKS.map((benchmark) => {
            const isBelow = engagementRate < benchmark.minimum;
            const isAbove = engagementRate > benchmark.maximum;
            const comparison = isBelow
              ? "Below range"
              : isAbove
                ? "Above range"
                : "Within range";

            return (
              <div
                key={benchmark.platform}
                className="rounded-xl border bg-card p-4"
              >
                <p className="font-medium">{benchmark.platform}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {benchmark.minimum}–{benchmark.maximum}%
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {comparison}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
