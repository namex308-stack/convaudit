"use client";

import { useState } from "react";
import { Loader2, AlertCircle, Copy, Check, Tag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { extractVideoId } from "@/lib/youtube";
import { copyText } from "@/lib/download";

/**
 * YouTube Tags Extractor.
 *
 * Sends the submitted video URL to the same-origin API, which fetches the
 * public video page and extracts its keyword tags.
 */
export function YouTubeTagsExtractor() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleExtract = async () => {
    setError(null);
    setTags([]);

    const id = extractVideoId(url);
    if (!id) {
      setError("Please enter a valid YouTube video URL.");
      return;
    }

    setLoading(true);
    try {
      const videoUrl = `https://www.youtube.com/watch?v=${id}`;
      let response: Response;
      try {
        response = await fetch("/api/youtube-tags", {
          method: "POST",
          credentials: "omit",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: videoUrl }),
        });
      } catch {
        throw new Error(
          "Could not reach the tag service. Check your connection and try again.",
        );
      }
      let payload: { error?: unknown; tags?: unknown };
      try {
        payload = await response.json();
      } catch {
        throw new Error("The server returned an unreadable response. Please try again.");
      }
      if (!response.ok) {
        throw new Error(
          typeof payload.error === "string"
            ? payload.error
            : "Could not fetch public video tags. Please try again.",
        );
      }
      if (
        !Array.isArray(payload.tags) ||
        !payload.tags.every((tag) => typeof tag === "string")
      ) {
        throw new Error("The server returned an unexpected response. Please try again.");
      }
      const extractedTags = payload.tags.filter(
        (tag): tag is string => typeof tag === "string",
      );
      setTags(extractedTags);

      if (extractedTags.length === 0) {
        setError("No public tags were found for this video.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to extract tags. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyAllTags = async () => {
    const ok = await copyText(tags.join(", "));
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 2000);
  };

  const copyTag = (tag: string) => {
    copyText(tag);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="yt-url">YouTube video URL</Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="yt-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            onKeyDown={(e) => e.key === "Enter" && handleExtract()}
            disabled={loading}
          />
          <Button onClick={handleExtract} disabled={loading || !url.trim()} className="sm:w-auto">
            {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Search className="mr-1.5 h-4 w-4" />}
            Extract Tags
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Only the video URL is sent to our server to fetch public tags.
        </p>
      </div>

      {error && !tags.length && (
        <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
          <span>{error}</span>
        </div>
      )}

      {tags.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {tags.length} tag{tags.length === 1 ? "" : "s"} found
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={copyAllTags}>
              {copied ? <Check className="mr-1 h-3.5 w-3.5 text-emerald-600" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy all"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <button
                key={i}
                onClick={() => copyTag(tag)}
                className="group"
                title="Click to copy"
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer text-xs transition-colors hover:bg-accent"
                >
                  {tag}
                </Badge>
              </button>
            ))}
          </div>
          {error && (
            <p className="text-xs text-muted-foreground">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
