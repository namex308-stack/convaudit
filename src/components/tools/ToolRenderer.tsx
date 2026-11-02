"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useInViewport } from "./useInViewport";

const toolComponents: Record<string, ComponentType> = {
  "compress-image": dynamic(() =>
    import("./CompressImageTool").then((module) => module.CompressImageTool),
  ),
  "remove-background": dynamic(() =>
    import("./RemoveBackgroundTool").then(
      (module) => module.RemoveBackgroundTool,
    ),
  ),
  "heic-to-jpg": dynamic(() =>
    import("./HeicToJpgTool").then((module) => module.HeicToJpgTool),
  ),
  "merge-pdf": dynamic(() =>
    import("./MergePdfTool").then((module) => module.MergePdfTool),
  ),
  "split-pdf": dynamic(() =>
    import("./SplitPdfTool").then((module) => module.SplitPdfTool),
  ),
  "rotate-pdf": dynamic(() =>
    import("./RotatePdfTool").then((module) => module.RotatePdfTool),
  ),
  "pdf-to-word": dynamic(() =>
    import("./PdfToWordTool").then((module) => module.PdfToWordTool),
  ),
  "image-to-pdf": dynamic(() =>
    import("./ImageToPdfTool").then((module) => module.ImageToPdfTool),
  ),
  "compress-pdf": dynamic(() =>
    import("./CompressPdfTool").then((module) => module.CompressPdfTool),
  ),
  "webp-to-png": dynamic(() =>
    import("./ImageFormatConverter").then((module) => module.WebpToPngTool),
  ),
  "png-to-jpg": dynamic(() =>
    import("./ImageFormatConverter").then((module) => module.PngToJpgTool),
  ),
  "jpg-to-webp": dynamic(() =>
    import("./ImageFormatConverter").then((module) => module.JpgToWebpTool),
  ),
  "remove-exif": dynamic(() =>
    import("./RemoveExifTool").then((module) => module.RemoveExifTool),
  ),
  "pdf-to-image": dynamic(() =>
    import("./PdfToImageTool").then((module) => module.PdfToImageTool),
  ),
  "youtube-thumbnail-downloader": dynamic(() =>
    import("./youtube/YouTubeThumbnailDownloader").then(
      (module) => module.YouTubeThumbnailDownloader,
    ),
  ),
  "youtube-thumbnail-resizer": dynamic(() =>
    import("./youtube/YouTubeThumbnailResizer").then(
      (module) => module.YouTubeThumbnailResizer,
    ),
  ),
  "youtube-tags-extractor": dynamic(() =>
    import("./youtube/YouTubeTagsExtractor").then(
      (module) => module.YouTubeTagsExtractor,
    ),
  ),
  "youtube-title-generator": dynamic(() =>
    import("./youtube/YouTubeTitleGenerator").then(
      (module) => module.YouTubeTitleGenerator,
    ),
  ),
  "youtube-description-generator": dynamic(() =>
    import("./youtube/YouTubeDescriptionGenerator").then(
      (module) => module.YouTubeDescriptionGenerator,
    ),
  ),
  "youtube-hashtag-generator": dynamic(() =>
    import("./youtube/YouTubeHashtagGenerator").then(
      (module) => module.YouTubeHashtagGenerator,
    ),
  ),
  "youtube-money-calculator": dynamic(() =>
    import("./youtube/YouTubeMoneyCalculator").then(
      (module) => module.YouTubeMoneyCalculator,
    ),
  ),
  "youtube-thumbnail-tester": dynamic(() =>
    import("./youtube/YouTubeThumbnailTester").then(
      (module) => module.YouTubeThumbnailTester,
    ),
  ),
  "youtube-channel-id-finder": dynamic(() =>
    import("./youtube/YouTubeChannelIdFinder").then(
      (module) => module.YouTubeChannelIdFinder,
    ),
  ),
  "youtube-timestamp-link-generator": dynamic(() =>
    import("./youtube/YouTubeTimestampLinkGenerator").then(
      (module) => module.YouTubeTimestampLinkGenerator,
    ),
  ),
  "engagement-rate-calculator": dynamic(() =>
    import("./calculators/EngagementRateCalculator").then(
      (module) => module.EngagementRateCalculator,
    ),
  ),
  "tiktok-money-calculator": dynamic(() =>
    import("./calculators/TikTokMoneyCalculator").then(
      (module) => module.TikTokMoneyCalculator,
    ),
  ),
  "influencer-rate-calculator": dynamic(() =>
    import("./calculators/InfluencerRateCalculator").then(
      (module) => module.InfluencerRateCalculator,
    ),
  ),
  "roas-calculator": dynamic(() =>
    import("./calculators/RoasCalculator").then(
      (module) => module.RoasCalculator,
    ),
  ),
  "follower-growth-calculator": dynamic(() =>
    import("./calculators/FollowerGrowthCalculator").then(
      (module) => module.FollowerGrowthCalculator,
    ),
  ),
};

export function ToolRenderer({ slug }: { slug: string }) {
  const { ref, isInViewport } = useInViewport<HTMLDivElement>();
  const ToolComponent = toolComponents[slug];

  return (
    <div ref={ref} className="min-h-120">
      {isInViewport && ToolComponent ? <ToolComponent /> : null}
    </div>
  );
}
