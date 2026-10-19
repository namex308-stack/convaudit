/**
 * Shared utilities for YouTube creator tools.
 *
 * Browser-safe helpers for YouTube creator tools. Metadata and thumbnail
 * helpers make direct requests to YouTube; tag extraction is handled by the
 * same-origin API route so its network access can be constrained.
 */

/** Result from the YouTube oEmbed endpoint. */
export type YouTubeOEmbed = {
  title: string;
  author_name: string;
  author_url: string;
  type: string;
  provider_name: string;
  provider_url: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  html: string;
  width: number;
  height: number;
  version: string;
};

/** All standard YouTube thumbnail resolutions for a given video ID. */
export type ThumbnailSet = {
  maxres: string; // 1280×720 (may not exist for older videos)
  sd: string; // 640×480
  hq: string; // 480×360
  mq: string; // 320×180
  default: string; // 120×90
};

/**
 * Ordered fallback chain, best → worst. maxres 404s on older/low-res
 * videos, so callers should walk this list instead of assuming
 * maxres exists.
 */
export const THUMBNAIL_FALLBACK_ORDER: (keyof ThumbnailSet)[] = [
  "maxres",
  "sd",
  "hq",
  "mq",
  "default",
];

/**
 * Extract the 11-character video ID from any common YouTube URL format:
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://youtu.be/VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID
 *  - https://www.youtube.com/shorts/VIDEO_ID
 *  - https://www.youtube.com/live/VIDEO_ID
 * Returns null if no valid ID is found.
 */
export function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      !["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(
        url.hostname.toLowerCase(),
      )
    ) {
      return null;
    }

    const match =
      url.hostname.toLowerCase() === "youtu.be"
        ? url.pathname.match(/^\/([A-Za-z0-9_-]{11})\/?$/)
        : url.pathname === "/watch"
          ? [null, url.searchParams.get("v") ?? ""]
          : url.pathname.match(/^\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})\/?$/);
    const id = match?.[1] ?? null;
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

/**
 * Build all standard thumbnail URLs for a video ID.
 * maxresdefault may return a 404 for older videos — callers should handle
 * image load errors and fall back to sd/hq.
 */
export function getThumbnailUrls(videoId: string): ThumbnailSet {
  const base = `https://img.youtube.com/vi/${videoId}`;
  return {
    maxres: `${base}/maxresdefault.jpg`,
    sd: `${base}/sddefault.jpg`,
    hq: `${base}/hqdefault.jpg`,
    mq: `${base}/mqdefault.jpg`,
    default: `${base}/default.jpg`,
  };
}

/**
 * Fetch oEmbed metadata for a YouTube video URL.
 * The oEmbed endpoint supports CORS and requires no API key.
 * Throws on network error or non-OK response.
 */
export async function fetchOEmbed(videoUrl: string): Promise<YouTubeOEmbed> {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    videoUrl
  )}&format=json`;
  const res = await fetch(endpoint);
  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? "Video not found. Check the URL and try again."
        : `Failed to fetch video metadata (HTTP ${res.status}).`
    );
  }
  return (await res.json()) as YouTubeOEmbed;
}

/**
 * Parse a timestamp string ("1:23", "01:23:45", "83") into seconds.
 * Returns -1 for invalid input so callers can distinguish "0:00"
 * (valid) from garbage (invalid). Previously every invalid string
 * returned 0, so "abc" silently generated a link to the start of
 * the video.
 */
export function parseTimestampToSeconds(input: string): number {
  const trimmed = input.trim();
  if (!trimmed) return -1;

  // Pure number → seconds
  if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10);

  const parts = trimmed.split(":").map((p) => p.trim());
  if (parts.some((p) => !/^\d+$/.test(p))) return -1;

  if (parts.length === 2) {
    // MM:SS
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }
  if (parts.length === 3) {
    // HH:MM:SS
    return (
      parseInt(parts[0], 10) * 3600 +
      parseInt(parts[1], 10) * 60 +
      parseInt(parts[2], 10)
    );
  }
  return -1;
}

/**
 * Format seconds as a human-readable timestamp.
 * 83 → "1:23", 3661 → "1:01:01"
 */
export function formatSecondsToTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Build a shareable YouTube timestamp link.
 * https://youtu.be/VIDEO_ID?t=SECONDS
 */
export function buildTimestampLink(videoId: string, seconds: number): string {
  return `https://youtu.be/${videoId}?t=${seconds}`;
}

/**
 * Extract a channel ID (UC...) from a YouTube channel URL.
 * Returns null if the URL doesn't contain a channel ID.
 */
export function extractChannelId(url: string): string | null {
  const match = url.match(/\/channel\/(UC[a-zA-Z0-9_-]{22})/);
  return match ? match[1] : null;
}

/**
 * Format a USD amount for display.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a large number (e.g. 1.5M views).
 */
export function formatLargeNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
