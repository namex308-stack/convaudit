"use client";

import { useState } from "react";
import JSZip from "jszip";
import { Loader2, Shield, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FileUploader, type UploadedFile } from "./FileUploader";
import { CancelOperationButton } from "./CancelOperationButton";
import { useOperationCancellation } from "./useOperationCancellation";
import { downloadBlob, formatBytes, shortId } from "@/lib/download";
import { throwIfCancelled } from "@/lib/file-validation";

type ResultItem = {
  name: string;
  blob: Blob;
  originalSize: number;
  compressedSize: number;
};

export function CompressImageTool() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [quality, setQuality] = useState(70);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const cancellation = useOperationCancellation();

  const handleFilesAdded = (newFiles: File[]) => {
    // Browsers may report an empty MIME type for some formats (notably
    // HEIC), so fall back to extension matching to avoid silently
    // dropping valid files.
    const accepted = newFiles.filter(
      (f) =>
        f.type.startsWith("image/") ||
        /\.(jpe?g|png|webp|gif|bmp|avif|tiff?|heic|heif)$/i.test(f.name)
    );
    setFiles((prev) => [
      ...prev,
      ...accepted.map((f) => ({ file: f, id: shortId() })),
    ]);
    setResults([]);
    setError(null);
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleProcessAnotherFile = () => {
    setFiles([]);
    setResults([]);
    setError(null);
    setProgress(0);
    setQuality(70);
  };

  const compressInBrowser = async (
    signal: AbortSignal
  ): Promise<ResultItem[]> => {
    const imageCompression = (await import("browser-image-compression")).default;
    const out: ResultItem[] = [];
    for (let i = 0; i < files.length; i++) {
      throwIfCancelled(signal);
      const f = files[i].file;
      const targetMb = Math.max(
        0.05,
        (f.size / (1024 * 1024)) * (quality / 100)
      );
      const compressed = await imageCompression(f, {
        maxSizeMB: targetMb,
        maxWidthOrHeight: 4096,
        useWebWorker: true,
        initialQuality: quality / 100,
        signal,
      });
      throwIfCancelled(signal);
      const baseName = f.name.replace(/\.[^.]+$/, "");
      const ext = f.name.split(".").pop()?.toLowerCase() || "jpg";
      out.push({
        name: `${baseName}-compressed.${ext}`,
        blob: compressed,
        originalSize: f.size,
        compressedSize: compressed.size,
      });
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }
    return out;
  };

  const handleCompress = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setResults([]);
    const controller = cancellation.start();

    try {
      setResults(await compressInBrowser(controller.signal));
    } catch (err) {
      if (controller.signal.aborted) {
        setError("Compression cancelled. No partial results were saved.");
      } else {
        console.error(err);
        setError("Failed to compress one or more images. Please try again.");
      }
    } finally {
      cancellation.finish(controller);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
        <Shield className="h-4 w-4 flex-none text-emerald-500" />
        Images are compressed in your browser; the image files are not sent to our server.
      </div>

      <FileUploader
        accept="image/*,.heic,.heif,.tiff,.tif,.bmp,.gif,.avif"
        multiple
        files={files}
        onFilesAdded={handleFilesAdded}
        onFileRemove={handleRemove}
        hint="Supports common image formats. Batch processing is supported."
        disabled={isProcessing}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="quality">Quality</Label>
          <span className="text-sm font-medium tabular-nums">{quality}</span>
        </div>
        <Slider
          id="quality"
          min={10}
          max={100}
          step={5}
          value={[quality]}
          onValueChange={(v) => setQuality(v[0])}
          disabled={isProcessing}
        />
        <p className="text-xs text-muted-foreground">
          Lower quality = smaller file size. Try 60-80 for photos, 80-95 for
          screenshots.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              {cancellation.isCancelling
                ? "Stopping compression..."
                : `Compressing... ${progress}%`}
            </span>
            <CancelOperationButton
              onCancel={cancellation.cancel}
              isCancelling={cancellation.isCancelling}
            />
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-foreground transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <Button
        onClick={handleCompress}
        disabled={files.length === 0 || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Shield className="mr-2 h-4 w-4" />
        )}
        {isProcessing
          ? "Compressing..."
          : `Compress ${files.length || ""} Image${files.length === 1 ? "" : "s"}`}
      </Button>

      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Results</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleProcessAnotherFile}>
                Process another file
              </Button>
              {results.length > 1 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const zip = new JSZip();
                    for (const r of results) zip.file(r.name, r.blob);
                    const blob = await zip.generateAsync({ type: "blob" });
                    downloadBlob(blob, "convaudit-compressed-images.zip");
                  }}
                >
                  <Archive className="mr-1 h-3.5 w-3.5" /> Download all as ZIP
                </Button>
              )}
            </div>
          </div>
          <ul className="space-y-2">
            {results.map((r, i) => {
              const savedPct = Math.round(
                (1 - r.compressedSize / r.originalSize) * 100
              );
              return (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-lg border bg-card p-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(r.originalSize)} →{" "}
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {formatBytes(r.compressedSize)}
                      </span>{" "}
                      ({savedPct >= 0 ? `-${savedPct}%` : `+${Math.abs(savedPct)}%`})
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadBlob(r.blob, r.name)}
                  >
                    Download
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
