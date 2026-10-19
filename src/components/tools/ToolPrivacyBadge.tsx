import { Badge } from "@/components/ui/badge";
import type { ToolPrivacyMode } from "@/lib/tools";

const PRIVACY_BADGES: Record<
  ToolPrivacyMode,
  { label: string; detail: string }
> = {
  browser: {
    label: "Processed in your browser",
    detail: "The tool's processing runs in your browser.",
  },
  "youtube-thumbnails": {
    label: "Fetches data from YouTube",
    detail:
      "Video metadata and public thumbnail images are requested directly from YouTube by your browser.",
  },
  "youtube-thumbnail-preview": {
    label: "Fetches thumbnails from YouTube",
    detail:
      "When you enter a YouTube URL, public thumbnail images are loaded directly from YouTube. Image-file previews stay in your browser.",
  },
  "youtube-and-proxy": {
    label: "Sends URLs to third parties",
    detail:
      "Video lookups send the video URL to YouTube; handle lookups send the channel URL to the AllOrigins proxy.",
  },
  "server-video-url": {
    label: "Sends video URL to our server",
    detail:
      "Only the video URL is sent to our server, which fetches the public YouTube page to read its tags.",
  },
};

export function ToolPrivacyBadge({ mode }: { mode: ToolPrivacyMode }) {
  const disclosure = PRIVACY_BADGES[mode];

  return (
    <Badge
      variant="outline"
      className="w-fit max-w-full whitespace-normal text-left text-xs font-normal"
      title={disclosure.detail}
    >
      {disclosure.label}
    </Badge>
  );
}
