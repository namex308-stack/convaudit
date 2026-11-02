export const CREATOR_SHARE = 0.55;

// TODO_OWNER: Verify CREATOR_SHARE against the YouTube Help Center:
// https://support.google.com/youtube/answer/72902?hl=en
export const CPM_RANGES = {
  "Finance / Investing": { low: 15, high: 35 },
  "Tech / Software": { low: 8, high: 20 },
  "Business / Marketing": { low: 8, high: 18 },
  "Education / How-to": { low: 6, high: 15 },
  Gaming: { low: 3, high: 8 },
  Entertainment: { low: 2, high: 6 },
  "Vlog / Lifestyle": { low: 3, high: 8 },
  "Beauty / Fashion": { low: 4, high: 10 },
  "Food / Cooking": { low: 4, high: 9 },
  "Health / Fitness": { low: 5, high: 12 },
  Music: { low: 1, high: 4 },
  "Kids / Family": { low: 1, high: 3 },
  "News / Politics": { low: 3, high: 10 },
  Sports: { low: 3, high: 8 },
  "Auto / Vehicles": { low: 5, high: 12 },
  Travel: { low: 4, high: 10 },
} as const satisfies Record<string, Readonly<{ low: number; high: number }>>;

export const lastReviewed = "2026-10-19";

export type YouTubeNiche = keyof typeof CPM_RANGES;

export type NicheCPM = {
  niche: YouTubeNiche;
  cpmLow: number;
  cpmHigh: number;
};

export const YOUTUBE_NICHES: NicheCPM[] = (
  Object.keys(CPM_RANGES) as YouTubeNiche[]
).map((niche) => ({
  niche,
  cpmLow: CPM_RANGES[niche].low,
  cpmHigh: CPM_RANGES[niche].high,
}));

export type EarningsEstimate = {
  low: number;
  mid: number;
  high: number;
};

export type YouTubeEarnings = {
  monthly: EarningsEstimate;
  annual: EarningsEstimate;
  rpm: EarningsEstimate;
};

function roundToCents(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function calculateEarnings(
  views: number,
  niche: NicheCPM,
): YouTubeEarnings {
  const cpmMid = (niche.cpmLow + niche.cpmHigh) / 2;
  const rpm = {
    low: roundToCents(niche.cpmLow * CREATOR_SHARE),
    mid: roundToCents(cpmMid * CREATOR_SHARE),
    high: roundToCents(niche.cpmHigh * CREATOR_SHARE),
  };
  const monthly = {
    low: roundToCents((views / 1000) * rpm.low),
    mid: roundToCents((views / 1000) * rpm.mid),
    high: roundToCents((views / 1000) * rpm.high),
  };

  return {
    monthly,
    rpm,
    annual: {
      low: roundToCents(monthly.low * 12),
      mid: roundToCents(monthly.mid * 12),
      high: roundToCents(monthly.high * 12),
    },
  };
}
