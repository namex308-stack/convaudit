"use client";

import { useRef, useState } from "react";
import { Upload, Youtube, AlertCircle, Smartphone, Monitor, Tv, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  extractVideoId,
  getThumbnailUrls,
  THUMBNAIL_FALLBACK_ORDER,
} from "@/lib/youtube";
import {
  FILE_SIZE_GUIDANCE,
  validateToolFile,
} from "@/lib/file-validation";

type PreviewSize = {
  key: string;
  label: string;
  width: number;
  height: number;
  icon: React.ReactNode;
  description: string;
};

/**
 * Real-world YouTube thumbnail display sizes, based on actual YouTube
 * UI measurements across devices.
 */
const PREVIEW_SIZES: PreviewSize[] = [
  { key: "mobile-feed", label: "Mobile Feed", width: 210, height: 118, icon: <Smartphone className="h-4 w-4" />, description: "Home feed on phones — 70%+ of watch time" },
  { key: "desktop-search", label: "Desktop Search", width: 246, height: 138, icon: <Monitor className="h-4 w-4" />, description: "Search results on desktop" },
  { key: "sidebar", label: "Sidebar Suggestion", width: 168, height: 94, icon: <Monitor className="h-4 w-4" />, description: "Related videos in the sidebar" },
  { key: "notification", label: "Notification", width: 120, height: 68, icon: <Bell className="h-4 w-4" />, description: "Push notification preview" },
  { key: "tv", label: "Smart TV", width: 480, height: 270, icon: <Tv className="h-4 w-4" />, description: "TV app (scaled for preview)" },
];

/**
 * YouTube Thumbnail Tester.
 *
 * Loads a thumbnail from an uploaded image or a YouTube URL, then renders
 * it at the actual display sizes YouTube uses across devices. Helps
 * creators verify text legibility and face visibility at small sizes.
 */
export function YouTubeThumbnailTester() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fallbackIdx, setFallbackIdx] = useState(0);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    const validationError = validateToolFile(
      file,
      "image/*,.heic,.heif,.tiff,.tif,.bmp,.gif,.avif"
    );
    if (validationError) {
      setError(validationError);
      return;
    }
    // Revoke the previous object URL to avoid leaking memory on
    // repeated uploads.
    setImageUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return prev;
    });
    setFallbackIdx(0);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleUrlLoad = () => {
    setError(null);
    const id = extractVideoId(url);
    if (!id) {
      setError("Please enter a valid YouTube video URL.");
      return;
    }
    const thumbs = getThumbnailUrls(id);
    // Don't assume maxres exists — older videos 404 on it. Start from
    // the best URL and let onError walk down the fallback chain.
    setFallbackIdx(0);
    setImageUrl(thumbs[THUMBNAIL_FALLBACK_ORDER[0]]);
  };

  const handlePreviewError = () => {
    if (!url) return;
    const id = extractVideoId(url);
    if (!id) return;
    const thumbs = getThumbnailUrls(id);
    const next = fallbackIdx + 1;
    if (next < THUMBNAIL_FALLBACK_ORDER.length) {
      setFallbackIdx(next);
      setImageUrl(thumbs[THUMBNAIL_FALLBACK_ORDER[next]]);
    } else {
      setError("Failed to load image. If using a YouTube URL, the thumbnail may not be available — try uploading instead.");
    }
  };

  const handleProcessAnotherImage = () => {
    setImageUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
    setFallbackIdx(0);
    setError(null);
    setUrl("");
  };

  return (
    <div className="space-y-5">
      {/* Input: upload or URL */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="thumbnail-upload">Upload your thumbnail</Label>
          <button
            type="button"
            aria-label={`Upload a thumbnail image. ${FILE_SIZE_GUIDANCE}`}
            aria-describedby="thumbnail-upload-help"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className="flex min-h-[180px] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-6 text-center text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Upload className="h-6 w-6" aria-hidden />
            <span className="font-medium text-foreground">
              Drop an image here, or click to browse
            </span>
            <span id="thumbnail-upload-help" className="text-xs">
              JPG, PNG, WebP, and more · {FILE_SIZE_GUIDANCE}
            </span>
          </button>
          <input
            ref={fileInputRef}
            id="thumbnail-upload"
            type="file"
            accept="image/*,.heic,.heif,.tiff,.tif,.bmp,.gif,.avif"
            className="hidden"
            tabIndex={-1}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFile(file);
              event.currentTarget.value = "";
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yt-url">Or load from YouTube URL</Label>
          <div className="flex gap-2">
            <Input
              id="yt-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              onKeyDown={(e) => e.key === "Enter" && handleUrlLoad()}
            />
            <Button onClick={handleUrlLoad} disabled={!url.trim()} size="sm" className="flex-none">
              <Youtube className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
          <span>{error}</span>
        </div>
      )}

      {imageUrl && (
        <div className="space-y-6">
          {/* Full-size preview */}
          <div className="overflow-hidden rounded-xl border bg-muted/30 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Full size (1280×720 source)
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleProcessAnotherImage}
              >
                Process another image
              </Button>
            </div>
            <img
              src={imageUrl}
              alt="Full-size thumbnail"
              className="mx-auto max-w-full rounded-lg"
              onError={handlePreviewError}
            />
          </div>

          {/* Real-world sizes */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">
              Real-world display sizes
            </h3>
            <p className="mb-4 text-xs text-muted-foreground">
              These are the actual pixel dimensions YouTube renders your thumbnail at across devices. If text isn't legible at the smallest sizes, viewers will scroll past.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PREVIEW_SIZES.map((size) => (
                <div
                  key={size.key}
                  className="rounded-lg border bg-card p-4"
                >
                  <div className="mb-3 flex items-center gap-2">
                    {size.icon}
                    <div>
                      <p className="text-sm font-medium">{size.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {size.width}×{size.height}px
                      </p>
                    </div>
                  </div>
                  <div
                    className="overflow-hidden rounded bg-black"
                    style={{ width: `${size.width}px`, height: `${size.height}px`, maxWidth: "100%" }}
                  >
                    <img
                      src={imageUrl}
                      alt={`${size.label} preview`}
                      className="h-full w-full object-cover"
                      style={{ width: `${size.width}px`, height: `${size.height}px` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {size.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
            <strong className="text-foreground">Design tip:</strong> Design your thumbnail for the smallest size first (120×68px notification). If your text and face are legible there, they'll look great everywhere.
          </div>
        </div>
      )}
    </div>
  );
}
