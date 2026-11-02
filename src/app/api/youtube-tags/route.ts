import { isIP } from "node:net";

export const runtime = "nodejs";

const ALLOWED_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
]);
const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const MAX_REQUEST_BYTES = 4096;
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 10_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const MAX_RATE_LIMIT_ENTRIES = 5000;

type RateLimitEntry = { count: number; resetAt: number };
const rateLimits = new Map<string, RateLimitEntry>();

function jsonResponse(body: object, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function getVideoId(input: unknown): string | null {
  if (typeof input !== "string" || input.length > 2048) return null;

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }

  const hostname = url.hostname.toLowerCase();
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    isIP(hostname) !== 0 ||
    !ALLOWED_HOSTS.has(hostname)
  ) {
    return null;
  }

  let id: string | null = null;
  if (hostname === "youtu.be") {
    const match = url.pathname.match(/^\/([A-Za-z0-9_-]{11})\/?$/);
    id = match?.[1] ?? null;
  } else if (url.pathname === "/watch") {
    id = url.searchParams.get("v");
  } else {
    const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})\/?$/);
    id = match?.[1] ?? null;
  }

  return id && VIDEO_ID_PATTERN.test(id) ? id : null;
}

function getClientKey(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp && isIP(realIp) !== 0) return realIp;

  const forwardedIp = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    .trim();
  return forwardedIp && isIP(forwardedIp) !== 0 ? forwardedIp : "unknown";
}

function isRateLimited(key: string, now: number): boolean {
  for (const [entryKey, entry] of rateLimits) {
    if (entry.resetAt <= now) rateLimits.delete(entryKey);
  }

  let entry = rateLimits.get(key);
  if (!entry) {
    if (rateLimits.size >= MAX_RATE_LIMIT_ENTRIES) return true;
    entry = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimits.set(key, entry);
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return true;
  entry.count += 1;
  return false;
}

async function readLimitedBody(response: Response): Promise<string> {
  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_RESPONSE_BYTES) {
    throw new Error("Response too large");
  }
  if (!response.body) throw new Error("Empty response");

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_RESPONSE_BYTES) {
      await reader.cancel();
      throw new Error("Response too large");
    }
    chunks.push(value);
  }

  const content = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    content.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(content);
}

async function readLimitedRequestBody(request: Request): Promise<string> {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    throw new Error("Request too large");
  }
  if (!request.body) throw new Error("Request body missing");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new Error("Request too large");
    }
    chunks.push(value);
  }

  const content = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    content.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(content);
}

function extractTags(html: string): string[] {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const keywordsTag = metaTags.find(
    (tag) => /\bname\s*=\s*["']keywords["']/i.test(tag),
  );
  const content = keywordsTag?.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1];
  if (!content) return [];

  return content
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0 && tag.length < 100);
}

export async function POST(request: Request) {
  if (isRateLimited(getClientKey(request), Date.now())) {
    return jsonResponse(
      { error: "Too many requests. Please wait a minute and try again." },
      429,
    );
  }

  let requestBody: string;
  try {
    requestBody = await readLimitedRequestBody(request);
  } catch {
    return jsonResponse({ error: "Request is too large or could not be read." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(requestBody);
  } catch {
    return jsonResponse({ error: "Send a valid YouTube video URL." }, 400);
  }

  const videoUrl =
    typeof body === "object" && body !== null && "url" in body
      ? (body as { url?: unknown }).url
      : null;
  const videoId = getVideoId(videoUrl);
  if (!videoId) {
    return jsonResponse(
      {
        error:
          "Enter a valid HTTPS video URL from youtube.com, m.youtube.com, or youtu.be.",
      },
      400,
    );
  }

  const timeout = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(
      `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
      {
        headers: { Accept: "text/html" },
        cache: "no-store",
        redirect: "manual",
        signal: timeout,
      },
    );
  } catch {
    return jsonResponse(
      {
        error: timeout.aborted
          ? "YouTube took too long to respond. Please try again."
          : "Could not fetch public video tags. Please try again later.",
      },
      timeout.aborted ? 504 : 502,
    );
  }

  if (response.status >= 300 && response.status < 400) {
    return jsonResponse(
      { error: "YouTube redirected this request, so tags could not be fetched safely." },
      502,
    );
  }
  if (!response.ok) {
    return jsonResponse(
      { error: "Could not fetch public video tags. Check the URL and try again." },
      502,
    );
  }

  let html: string;
  try {
    html = await readLimitedBody(response);
  } catch {
    return jsonResponse(
      {
        error: timeout.aborted
          ? "YouTube took too long to respond. Please try again."
          : "The video page could not be read safely. Please try again later.",
      },
      timeout.aborted ? 504 : 502,
    );
  }

  return jsonResponse({ tags: extractTags(html) });
}
