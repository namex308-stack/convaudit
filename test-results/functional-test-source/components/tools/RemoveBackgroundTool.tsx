"use client";

import { useEffect, useRef, useState } from "react";
import {
  Archive,
  Check,
  Download,
  ImagePlus,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileUploader, type UploadedFile } from "./FileUploader";
import { downloadBlob, shortId } from "@/lib/download";

type Segmenter = import("@huggingface/transformers").BackgroundRemovalPipelineType;

type QueueItem = UploadedFile & {
  previewUrl: string;
  status: "queued" | "processing" | "done" | "error";
  progress: number;
  progressLabel: string;
  output?: Blob;
  outputUrl?: string;
  error?: string;
  notice?: string;
};

type SourceImage = {
  blob: Blob;
  width: number;
  height: number;
  notice?: string;
};

const MODEL_ID = "Xenova/modnet";
const PROCESSING_TIMEOUT_MS = 180_000;
const MAX_PIXELS = 8_000_000;

function isSupportedImage(file: File): boolean {
  return (
    ["image/jpeg", "image/png", "image/webp"].includes(file.type.toLowerCase()) ||
    /\.(jpe?g|png|webp)$/i.test(file.name)
  );
}

function getDevicePixelLimit(): number {
  const navigatorWithMemory = navigator as Navigator & {
    deviceMemory?: number;
  };
  const lowMemory =
    (navigatorWithMemory.deviceMemory !== undefined &&
      navigatorWithMemory.deviceMemory <= 4) ||
    navigator.hardwareConcurrency <= 4;
  return lowMemory ? 4_000_000 : MAX_PIXELS;
}

async function prepareSourceImage(file: File): Promise<SourceImage> {
  if (typeof createImageBitmap !== "function") {
    throw new Error("This browser cannot decode images for local processing.");
  }

  const bitmap = await createImageBitmap(file);
  try {
    const originalPixels = bitmap.width * bitmap.height;
    const pixelLimit = getDevicePixelLimit();
    const scale =
      originalPixels > pixelLimit ? Math.sqrt(pixelLimit / originalPixels) : 1;
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: false });
    if (!context) throw new Error("Your browser could not create an image canvas.");

    context.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (output) =>
          output
            ? resolve(output)
            : reject(new Error("Could not prepare this image for processing.")),
        "image/png",
      );
    });
    canvas.width = 0;
    canvas.height = 0;

    return {
      blob,
      width,
      height,
      ...(scale < 1
        ? {
            notice: `Downscaled from ${bitmap.width.toLocaleString()} × ${bitmap.height.toLocaleString()} to ${width.toLocaleString()} × ${height.toLocaleString()} pixels to fit your device's memory limit.`,
          }
        : {}),
    };
  } finally {
    bitmap.close();
  }
}

/**
 * Blur only the output's alpha channel so the transparent cutout edge is less harsh.
 */
async function featherCutout(
  output: import("@huggingface/transformers").RawImage,
): Promise<Blob> {
  if (output.channels !== 4) {
    throw new Error("The model returned an unsupported image format.");
  }

  const width = output.width;
  const height = output.height;
  const outputCanvas = document.createElement("canvas");
  const alphaCanvas = document.createElement("canvas");
  const blurredCanvas = document.createElement("canvas");
  for (const canvas of [outputCanvas, alphaCanvas, blurredCanvas]) {
    canvas.width = width;
    canvas.height = height;
  }

  const outputContext = outputCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  const alphaContext = alphaCanvas.getContext("2d", {
    willReadFrequently: false,
  });
  const blurredContext = blurredCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  try {
    if (!outputContext || !alphaContext || !blurredContext) {
      throw new Error("Your browser could not refine the image edges.");
    }

    const rgba = new ImageData(width, height);
    rgba.data.set(output.data);
    outputContext.putImageData(rgba, 0, 0);

    const alphaMask = new ImageData(width, height);
    for (let pixel = 0; pixel < width * height; pixel++) {
      const alpha = rgba.data[pixel * 4 + 3];
      const offset = pixel * 4;
      alphaMask.data[offset] = alpha;
      alphaMask.data[offset + 1] = alpha;
      alphaMask.data[offset + 2] = alpha;
      alphaMask.data[offset + 3] = 255;
    }
    alphaContext.putImageData(alphaMask, 0, 0);
    blurredContext.filter = "blur(1.2px)";
    blurredContext.drawImage(alphaCanvas, 0, 0);
    blurredContext.filter = "none";
    const featheredAlpha = blurredContext.getImageData(0, 0, width, height);

    for (let pixel = 0; pixel < width * height; pixel++) {
      rgba.data[pixel * 4 + 3] = featheredAlpha.data[pixel * 4];
    }
    outputContext.putImageData(rgba, 0, 0);

    return await new Promise<Blob>((resolve, reject) => {
      outputCanvas.toBlob(
        (result) =>
          result
            ? resolve(result)
            : reject(new Error("Could not create the transparent PNG.")),
        "image/png",
      );
    });
  } finally {
    for (const canvas of [outputCanvas, alphaCanvas, blurredCanvas]) {
      canvas.width = 0;
      canvas.height = 0;
    }
  }
}

function getFriendlyError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (/timeout/i.test(message)) {
    return "This image took too long to process. Retry it, or use a smaller image and close other tabs.";
  }
  if (
    error instanceof RangeError ||
    /memory|allocation|ArrayBuffer|out of memory/i.test(message)
  ) {
    return "Your device ran low on memory. Close other tabs, retry with a smaller image, or process fewer images at once.";
  }
  if (/decode|unsupported|image format|corrupt/i.test(message)) {
    return "This image could not be decoded. Try a valid JPG, PNG, or WebP file.";
  }
  return "Could not remove this image's background. Try another image or retry after closing other tabs.";
}

function getOutputName(fileName: string): string {
  return `${fileName.replace(/\.[^.]+$/, "")}-no-bg.png`;
}

export function RemoveBackgroundTool() {
  const [files, setFiles] = useState<QueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [comparison, setComparison] = useState(50);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingZip, setIsCreatingZip] = useState(false);
  const [modelMessage, setModelMessage] = useState<string | null>(null);
  const segmenterRef = useRef<Segmenter | null>(null);
  const filesRef = useRef<QueueItem[]>([]);

  filesRef.current = files;

  useEffect(
    () => () => {
      for (const item of filesRef.current) {
        URL.revokeObjectURL(item.previewUrl);
        if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
      }
    },
    [],
  );

  const updateItem = (
    id: string,
    update: (item: QueueItem) => QueueItem,
  ) => {
    setFiles((current) => current.map((item) => (item.id === id ? update(item) : item)));
  };

  const handleFilesAdded = (newFiles: File[]) => {
    const validFiles = newFiles.filter(isSupportedImage);
    const rejectedCount = newFiles.length - validFiles.length;
    if (rejectedCount > 0) {
      setError(
        `${rejectedCount} file${rejectedCount === 1 ? " was" : "s were"} skipped. Choose JPG, PNG, or WebP images.`,
      );
    } else {
      setError(null);
    }

    const added = validFiles.map((file): QueueItem => ({
      file,
      id: shortId(),
      previewUrl: URL.createObjectURL(file),
      status: "queued",
      progress: 0,
      progressLabel: "Waiting",
    }));
    setFiles((current) => [...current, ...added]);
    if (!activeFileId && added[0]) setActiveFileId(added[0].id);
  };

  const handleRemove = (id: string) => {
    const removed = files.find((item) => item.id === id);
    if (removed) {
      URL.revokeObjectURL(removed.previewUrl);
      if (removed.outputUrl) URL.revokeObjectURL(removed.outputUrl);
    }
    setFiles((current) => current.filter((item) => item.id !== id));
    if (activeFileId === id) {
      setActiveFileId(files.find((item) => item.id !== id)?.id ?? null);
    }
  };

  const getSegmenter = async (
    onProgress: (progress: number, label: string) => void,
  ): Promise<Segmenter> => {
    if (segmenterRef.current) return segmenterRef.current;

    setModelMessage(
      "Loading the AI model. The first download is about 12 MB plus runtime files; the browser caches it where supported.",
    );
    const { env, pipeline } = await import("@huggingface/transformers");
    env.useBrowserCache = true;
    env.useFS = false;

    const segmenter = await pipeline("background-removal", MODEL_ID, {
      dtype: "q4f16",
      progress_callback: (info) => {
        if (info.status === "progress") {
          onProgress(
            Math.round((info.progress / 100) * 45),
            `Downloading AI model: ${info.file}`,
          );
        } else if (info.status === "ready") {
          onProgress(45, "AI model ready; processing locally");
          setModelMessage(
            "AI model ready. Model files are stored in the browser cache where supported.",
          );
        } else if (info.status === "download") {
          setModelMessage("Downloading AI model files for first use…");
        }
      },
    });
    segmenterRef.current = segmenter;
    return segmenter;
  };

  const runWithTimeout = async <T,>(
    operation: Promise<T>,
    timeoutMs: number,
  ): Promise<T> => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        operation,
        new Promise<T>((_, reject) => {
          timeoutId = setTimeout(
            () => reject(new Error("Processing timeout")),
            timeoutMs,
          );
        }),
      ]);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  };

  const handleProcess = async () => {
    const queued = files.filter(
      (item) => item.status === "queued" || item.status === "error",
    );
    if (queued.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setModelMessage(null);

    for (const queuedItem of queued) {
      updateItem(queuedItem.id, (item) => ({
        ...item,
        status: "processing",
        progress: 3,
        progressLabel: "Preparing image",
        error: undefined,
      }));

      let segmenter: Segmenter | null = null;
      try {
        const source = await prepareSourceImage(queuedItem.file);
        updateItem(queuedItem.id, (item) => ({
          ...item,
          progress: 10,
          progressLabel: "Loading AI model",
          notice: source.notice,
        }));

        segmenter = await getSegmenter((progress, progressLabel) => {
          updateItem(queuedItem.id, (item) => ({
            ...item,
            progress: Math.max(item.progress, progress),
            progressLabel,
          }));
        });
        updateItem(queuedItem.id, (item) => ({
          ...item,
          progress: 55,
          progressLabel: "Running AI on your device",
        }));

        const output = await runWithTimeout(
          segmenter(source.blob),
          PROCESSING_TIMEOUT_MS,
        );
        if (output.length === 0) {
          throw new Error("The model returned no image.");
        }
        updateItem(queuedItem.id, (item) => ({
          ...item,
          progress: 82,
          progressLabel: "Refining transparent edges",
        }));
        const result = await featherCutout(output[0]);
        const outputUrl = URL.createObjectURL(result);
        updateItem(queuedItem.id, (item) => {
          if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
          return {
            ...item,
            status: "done",
            progress: 100,
            progressLabel: "Complete",
            output: result,
            outputUrl,
            notice: source.notice,
            error: undefined,
          };
        });
        setActiveFileId((current) => current ?? queuedItem.id);
      } catch (processingError) {
        console.error(processingError);
        if (
          segmenter &&
          segmenterRef.current === segmenter &&
          processingError instanceof Error &&
          /timeout/i.test(processingError.message)
        ) {
          segmenterRef.current = null;
          try {
            await segmenter.dispose();
          } catch (disposeError) {
            console.error("Could not release the timed-out model session.", disposeError);
          }
        }
        updateItem(queuedItem.id, (item) => ({
          ...item,
          status: "error",
          progress: 0,
          progressLabel: "Could not process",
          error: getFriendlyError(processingError),
        }));
      }
    }

    setIsProcessing(false);
  };

  const handleDownloadZip = async () => {
    const completed = files.filter(
      (item): item is QueueItem & { output: Blob } =>
        item.status === "done" && item.output !== undefined,
    );
    if (completed.length === 0) return;

    setIsCreatingZip(true);
    setError(null);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      for (const item of completed) {
        zip.file(getOutputName(item.file.name), item.output);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, "convaudit-background-removed.zip");
    } catch (zipError) {
      console.error(zipError);
      setError("Could not prepare the ZIP file. Download the finished images individually.");
    } finally {
      setIsCreatingZip(false);
    }
  };

  const activeFile = files.find((item) => item.id === activeFileId);
  const completedCount = files.filter((item) => item.status === "done").length;
  const queuedCount = files.filter(
    (item) => item.status === "queued" || item.status === "error",
  ).length;

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <p>
          Images stay on this device. The browser downloads the AI model and
          runs it locally; your photos are not uploaded.
        </p>
      </div>

      <FileUploader
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        multiple
        files={files}
        onFilesAdded={handleFilesAdded}
        onFileRemove={handleRemove}
        hint="Add JPG, PNG, or WebP images. They will be processed one at a time."
        disabled={isProcessing || isCreatingZip}
      />

      {modelMessage && (
        <p className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground" aria-live="polite">
          {modelMessage}
        </p>
      )}

      {files.length > 0 && (
        <section className="space-y-3" aria-label="Image processing queue">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">
              What is the image processing progress? ({completedCount} of{" "}
              {files.length} complete)
            </h2>
            {completedCount > 1 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleDownloadZip}
                disabled={isProcessing || isCreatingZip}
              >
                {isCreatingZip ? (
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                ) : (
                  <Archive className="mr-1.5 size-4" />
                )}
                Download all as ZIP
              </Button>
            )}
          </div>

          <ul className="space-y-2">
            {files.map((item) => (
              <li
                key={item.id}
                className={`rounded-lg border p-3 ${
                  activeFileId === item.id ? "border-primary/50 bg-primary/5" : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    onClick={() => setActiveFileId(item.id)}
                    aria-label={`Preview ${item.file.name}`}
                  >
                    <img
                      src={item.previewUrl}
                      alt=""
                      className="size-11 shrink-0 rounded object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {item.file.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {item.progressLabel}
                      </span>
                    </span>
                  </button>
                  {item.status === "done" && item.output ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      aria-label={`Download ${getOutputName(item.file.name)}`}
                      onClick={() =>
                        downloadBlob(item.output!, getOutputName(item.file.name))
                      }
                    >
                      <Download className="size-4" />
                    </Button>
                  ) : item.status === "queued" ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label={`Remove ${item.file.name}`}
                      disabled={isProcessing}
                      onClick={() => handleRemove(item.id)}
                    >
                      <X className="size-4" />
                    </Button>
                  ) : null}
                </div>
                {(item.status === "processing" || item.status === "done") && (
                  <Progress
                    value={item.progress}
                    className="mt-3 h-1.5"
                    aria-label={`${item.file.name}: ${item.progress}%`}
                  />
                )}
                {item.notice && (
                  <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                    {item.notice}
                  </p>
                )}
                {item.error && (
                  <p className="mt-2 text-xs text-destructive" role="alert">
                    {item.error}
                  </p>
                )}
              </li>
            ))}
          </ul>

          {activeFile?.outputUrl && (
            <div className="space-y-3 rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="min-w-0 truncate text-sm font-semibold">
                  Before and after: {activeFile.file.name}
                </h3>
                <span className="flex shrink-0 items-center gap-1 text-xs text-emerald-600">
                  <Check className="size-3.5" aria-hidden />
                  Transparent PNG
                </span>
              </div>
              <div className="relative mx-auto aspect-4/3 max-h-112 w-full overflow-hidden rounded-lg border bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%),linear-gradient(-45deg,#e5e7eb_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e7eb_75%),linear-gradient(-45deg,transparent_75%,#e5e7eb_75%)] bg-size-[20px_20px] bg-position-[0_0,0_10px,10px_-10px,-10px_0] dark:bg-[linear-gradient(45deg,#374151_25%,transparent_25%),linear-gradient(-45deg,#374151_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#374151_75%),linear-gradient(-45deg,transparent_75%,#374151_75%)]">
                <img
                  src={activeFile.previewUrl}
                  alt={`Original ${activeFile.file.name}`}
                  className="absolute inset-0 size-full object-contain"
                />
                <img
                  src={activeFile.outputUrl}
                  alt={`Background removed from ${activeFile.file.name}`}
                  className="absolute inset-0 size-full object-contain"
                  style={{ clipPath: `inset(0 ${100 - comparison}% 0 0)` }}
                />
                <div
                  className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white shadow"
                  style={{ left: `${comparison}%` }}
                  aria-hidden
                >
                  <span className="absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-primary text-white shadow">
                    <ImagePlus className="size-4" />
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={comparison}
                  onChange={(event) => setComparison(Number(event.target.value))}
                  aria-label="Drag to compare original image and background-removed result"
                  className="absolute inset-x-0 bottom-0 z-20 h-full w-full cursor-ew-resize appearance-none opacity-0 touch-pan-y"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Result</span>
                <span>Original</span>
              </div>
            </div>
          )}
        </section>
      )}

      {error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={handleProcess}
          disabled={queuedCount === 0 || isProcessing || isCreatingZip}
        >
          {isProcessing ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <ImagePlus className="mr-2 size-4" />
          )}
          {isProcessing
            ? "Removing backgrounds…"
            : queuedCount > 0
              ? `Remove backgrounds (${queuedCount})`
              : "All images processed"}
        </Button>
      )}
    </div>
  );
}
