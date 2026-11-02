"use client";

import { useState } from "react";
import { Download, Loader2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileUploader, type UploadedFile } from "./FileUploader";
import { downloadBytes, shortId } from "@/lib/download";

type PdfThumbnail = {
  pageNumber: number;
  dataUrl: string;
};

type RotationAngle = 90 | 180 | 270;

function getPdfErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  const name = error instanceof Error ? error.name : "";

  if (name === "PasswordException" || /password|encrypt/i.test(message)) {
    return "This PDF is password-protected. Remove its password before using this tool.";
  }
  if (/memory|allocation|out of memory/i.test(message)) {
    return "Your browser ran out of memory while processing this PDF. Try a smaller file or close other tabs.";
  }
  return "Could not process this PDF. The file may be corrupted or use an unsupported feature.";
}

export function RotatePdfTool() {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [thumbnails, setThumbnails] = useState<PdfThumbnail[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [rotation, setRotation] = useState<RotationAngle>(90);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesAdded = async (newFiles: File[]) => {
    const selectedFile = newFiles[0];
    if (!selectedFile) return;
    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file.");
      return;
    }

    setFile({ file: selectedFile, id: shortId() });
    setThumbnails([]);
    setSelectedPages([]);
    setResult(null);
    setError(null);
    setProgress(0);
    setIsLoadingPages(true);

    let document: Awaited<
      ReturnType<Awaited<ReturnType<typeof import("pdfjs-dist/build/pdf.mjs")>["getDocument"]>["promise"]>
    > | null = null;
    try {
      const pdfjs = await import("pdfjs-dist/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.mjs",
        import.meta.url,
      ).toString();

      const bytes = await selectedFile.arrayBuffer();
      document = await pdfjs.getDocument({ data: bytes }).promise;
      const pages: PdfThumbnail[] = [];

      for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
        const page = await document.getPage(pageNumber);
        const baseViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({
          scale: Math.min(180 / baseViewport.width, 180 / baseViewport.height),
        });
        const canvas = window.document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Unable to create a PDF preview canvas.");

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        pages.push({
          pageNumber,
          dataUrl: canvas.toDataURL("image/jpeg", 0.7),
        });
        canvas.width = 0;
        canvas.height = 0;
        page.cleanup();
        setProgress(Math.round((pageNumber / document.numPages) * 100));
      }

      setThumbnails(pages);
      setSelectedPages(pages.map((page) => page.pageNumber));
    } catch (loadError) {
      console.error(loadError);
      setError(getPdfErrorMessage(loadError));
      setFile(null);
    } finally {
      await document?.destroy();
      setIsLoadingPages(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setThumbnails([]);
    setSelectedPages([]);
    setResult(null);
    setProgress(0);
    setError(null);
  };

  const togglePage = (pageNumber: number) => {
    setSelectedPages((current) =>
      current.includes(pageNumber)
        ? current.filter((page) => page !== pageNumber)
        : [...current, pageNumber].sort((a, b) => a - b),
    );
    setResult(null);
  };

  const selectAllPages = () => {
    if (selectedPages.length === thumbnails.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(thumbnails.map((page) => page.pageNumber));
    }
    setResult(null);
  };

  const handleRotate = async () => {
    if (!file || selectedPages.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const pdf = await PDFDocument.load(await file.file.arrayBuffer());
      const selected = new Set(selectedPages);

      for (let index = 0; index < pdf.getPageCount(); index++) {
        if (selected.has(index + 1)) {
          const page = pdf.getPage(index);
          page.setRotation(
            degrees((page.getRotation().angle + rotation) % 360),
          );
        }
        setProgress(Math.round(((index + 1) / pdf.getPageCount()) * 100));
        if (index % 10 === 9) {
          await new Promise<void>((resolve) => setTimeout(resolve, 0));
        }
      }

      setResult(await pdf.save());
      setProgress(100);
    } catch (processingError) {
      console.error(processingError);
      setError(getPdfErrorMessage(processingError));
    } finally {
      setIsProcessing(false);
    }
  };

  const isBusy = isLoadingPages || isProcessing;
  const allPagesSelected =
    thumbnails.length > 0 && selectedPages.length === thumbnails.length;
  const outputName = file
    ? `${file.file.name.replace(/\.pdf$/i, "")}-rotated.pdf`
    : "rotated.pdf";

  return (
    <div className="space-y-5">
      <FileUploader
        accept="application/pdf,.pdf"
        files={file ? [file] : []}
        onFilesAdded={handleFilesAdded}
        onFileRemove={handleRemoveFile}
        hint="Upload a PDF to preview and select pages."
        disabled={isBusy}
      />

      {thumbnails.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {selectedPages.length} of {thumbnails.length} pages selected
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={selectAllPages}
              disabled={isBusy}
            >
              {allPagesSelected ? "Deselect all" : "Select all"}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {thumbnails.map(({ pageNumber, dataUrl }) => {
              const isSelected = selectedPages.includes(pageNumber);
              return (
                <button
                  key={pageNumber}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`Page ${pageNumber}${isSelected ? ", selected" : ""}`}
                  onClick={() => togglePage(pageNumber)}
                  disabled={isBusy}
                  className={`rounded-lg border p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <img
                    src={dataUrl}
                    alt={`Preview of page ${pageNumber}`}
                    className="mx-auto h-36 max-w-full object-contain"
                  />
                  <span className="mt-2 block text-center text-xs font-medium">
                    Page {pageNumber}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {thumbnails.length > 0 && (
        <div className="space-y-2">
          <label htmlFor="pdf-rotation" className="text-sm font-medium">
            Rotate clockwise
          </label>
          <select
            id="pdf-rotation"
            value={rotation}
            onChange={(event) =>
              setRotation(Number(event.target.value) as RotationAngle)
            }
            disabled={isBusy}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value={90}>90 degrees</option>
            <option value={180}>180 degrees</option>
            <option value={270}>270 degrees</option>
          </select>
        </div>
      )}

      {isBusy && (
        <div className="space-y-2" role="status" aria-live="polite">
          <p className="text-xs text-muted-foreground">
            {isLoadingPages
              ? `Preparing page previews... ${progress}%`
              : `Rotating PDF... ${progress}%`}
          </p>
          <Progress value={progress} />
        </div>
      )}

      {error && (
        <p
          className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}

      {thumbnails.length > 0 && (
        <Button
          type="button"
          onClick={handleRotate}
          disabled={!file || selectedPages.length === 0 || isBusy}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RotateCw className="mr-2 h-4 w-4" />
          )}
          {isProcessing ? "Rotating..." : "Rotate PDF"}
        </Button>
      )}

      {result && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/30 p-4">
          <p className="min-w-0 truncate text-sm font-medium">{outputName}</p>
          <Button
            type="button"
            onClick={() =>
              downloadBytes(result, outputName, "application/pdf")
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      )}
    </div>
  );
}
