/**
 * Tool definitions for the Online Tools website.
 * Each tool has SEO metadata, FAQs, and step-by-step instructions.
 */

import { CPM_RANGES, CREATOR_SHARE } from "./youtube-earnings";

const highestCpm = CPM_RANGES["Finance / Investing"];
const lowestCpm = CPM_RANGES.Music;

export type FAQ = { q: string; a: string };
export type ToolPrivacyMode =
  | "browser"
  | "youtube-thumbnails"
  | "youtube-thumbnail-preview"
  | "youtube-and-proxy"
  | "server-video-url";

export type Tool = {
  /** URL slug, e.g. "compress-image" */
  slug: string;
  /** Display name, e.g. "Compress Image" */
  name: string;
  /** SEO-friendly short description (under 160 chars recommended) */
  description: string;
  /** Category for grouping on the homepage */
  category: "Image" | "PDF" | "Conversion" | "YouTube";
  /** Data handling mode used by the shared per-tool privacy badge */
  privacyMode: ToolPrivacyMode;
  /** Search keywords for filtering / SEO meta */
  keywords: string[];
  /** Long-form description used inside the tool page body */
  longDescription: string;
  /** Important limitation shown beside the tool. */
  notice?: string;
  /** Frequently asked questions for the FAQ section + JSON-LD */
  faqs: FAQ[];
  /** Step-by-step instructions displayed under the tool */
  howToSteps: string[];
  /** Accent color used for the tool card icon badge */
  accent: string;
  /** Promotional badge like "Popular", "New", "Essential" */
  badge?: string;
  /** Slug of companion in-depth blog post */
  blogSlug?: string;
};

export const TOOLS: Tool[] = [
  {
    slug: "compress-image",
    name: "Compress Image",
    description:
      "Reduce JPG, PNG, and WebP image file sizes in your browser with a quality setting you control.",
    category: "Image",
    privacyMode: "browser",
    keywords: [
      "compress image",
      "image compressor",
      "reduce image size",
      "optimize jpg",
      "compress png",
      "shrink photo",
      "web image optimizer",
    ],
    longDescription:
      "Our Compress Image tool shrinks JPG, PNG, and WebP photos in your browser. Image files are not sent to our server for compression. Pick a target quality, add a batch of files, and download the results.",
    faqs: [
      {
        q: "Are my images uploaded to a server?",
        a: "No. Compression uses the Canvas API and browser-image-compression in your browser; the selected image files are not sent to our server for compression.",
      },
      {
        q: "What is the maximum file size I can compress?",
        a: "There is no fixed file size limit. Very large images may still be limited by your device's available memory.",
      },
      {
        q: "Which formats are supported?",
        a: "You can compress JPG, PNG, WebP, and most common image formats. Output is generated based on the source type.",
      },
      {
        q: "Will compression reduce quality?",
        a: "Some quality loss is expected with lossy compression. You control the quality level with the slider, so you can balance size and clarity.",
      },
    ],
    howToSteps: [
      "Drag and drop one or more images into the upload area, or click to browse.",
      "Adjust the quality slider to your preferred compression level (1-100).",
      "Click the Compress button and wait for the progress bar to finish.",
      "Download each compressed image individually, or grab them all as a ZIP.",
    ],
    accent: "#10b981",
  },
  {
    slug: "heic-to-jpg",
    name: "HEIC to JPG",
    description:
      "Convert Apple HEIC and HEIF photos from your iPhone into universally compatible JPG files directly in your browser.",
    category: "Conversion",
    privacyMode: "browser",
    keywords: [
      "heic to jpg",
      "heic converter",
      "heic to jpeg",
      "iphone photo converter",
      "convert heic",
      "heif to jpg",
    ],
    longDescription:
      "HEIC is the default photo format on modern iPhones, but many apps and websites still expect JPG. Our HEIC to JPG converter uses the heic2any library in your browser; selected photos are not sent to our server for conversion. Convert a single photo or a batch at once.",
    faqs: [
      {
        q: "Is this HEIC converter free?",
        a: "Yes, completely free with no watermarks, no sign-up, and no limits on the number of files you can convert.",
      },
      {
        q: "Does it work on Android or Windows?",
        a: "Yes. Because conversion runs in your browser using WebAssembly, it works on any modern browser regardless of operating system.",
      },
      {
        q: "Are my photos uploaded anywhere?",
        a: "HEIC decoding uses the heic2any library in your browser. The selected HEIC files are not sent to our server for conversion.",
      },
      {
        q: "Why does conversion take a few seconds per image?",
        a: "HEIC decoding is a CPU-intensive process. We use WebAssembly to decode locally, which is fast but still needs a moment per photo.",
      },
    ],
    howToSteps: [
      "Drag your HEIC files into the upload box, or click to select them.",
      "Optionally choose an output quality for the resulting JPG.",
      "Click Convert and watch the progress indicator.",
      "Download each JPG individually or all together as a ZIP archive.",
    ],
    accent: "#f59e0b",
  },
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    description:
      "Free online PDF merger: combine multiple PDF files into one in your browser. Reorder documents and download the result; files are not uploaded for processing.",
    category: "PDF",
    privacyMode: "browser",
    keywords: [
      "pdf merger free",
      "combine pdf files free",
      "merge pdf files free",
      "pdf combine free",
      "merge pdf documents for free",
      "merge pdf docs for free",
      "combine pdf online free",
      "merge pdf files online free",
      "merge pdf documents free online",
      "merge multiple pdf online free",
      "combine pdf files free online",
    ],
    longDescription:
      "Combine two or more PDF files into one document with this free online PDF merger. Reorder files with the up and down controls, remove files you don't need, and download the merged PDF. Processing happens locally in your browser; your documents are not uploaded for merging.",
    faqs: [
      {
        q: "Can I merge PDF documents online for free?",
        a: "Yes. Add two or more PDF files, arrange them in the order you want, and download one combined PDF at no charge. Processing happens in your browser.",
      },
      {
        q: "Is there a limit on the number of PDFs I can merge?",
        a: "There is no fixed file-count limit, but large PDFs or many files can be constrained by your browser's available memory.",
      },
      {
        q: "Can I change the order of the PDFs before combining them?",
        a: "Yes. Use the up and down controls beside each file to set the order. The tool combines whole files; it does not reorder individual pages within a file.",
      },
      {
        q: "Are my PDFs uploaded to a server?",
        a: "No. The merge runs locally in your browser, and the PDF file contents are not uploaded to our server for processing.",
      },
      {
        q: "Will the merged PDF keep every feature from the originals?",
        a: "The tool copies pages into a new PDF without rasterizing them, but interactive forms, bookmarks, attachments, metadata, and digital signatures may not be retained as in the source files. Review the result before relying on it.",
      },
    ],
    howToSteps: [
      "Add two or more PDF files using drag-and-drop or the file picker.",
      "Use the up and down controls to put the files in the desired order.",
      "Click Merge PDFs to combine them.",
      "Download the resulting single PDF file.",
    ],
    accent: "#ef4444",
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    description:
      "Extract pages or split a PDF into multiple files by page ranges in your browser.",
    category: "PDF",
    privacyMode: "browser",
    keywords: [
      "split pdf",
      "pdf splitter",
      "extract pdf pages",
      "divide pdf",
      "separate pdf pages",
    ],
    longDescription:
      "The Split PDF tool lets you carve a PDF into smaller pieces. Provide page ranges like 1-3, 5, 7-9, and each range becomes a separate PDF. Powered by pdf-lib in the browser, so your sensitive documents stay on your computer.",
    faqs: [
      {
        q: "How do I specify which pages to extract?",
        a: "Use comma-separated ranges such as 1-3, 5, 7-9. Each range will produce a separate output PDF.",
      },
      {
        q: "Are my PDFs uploaded anywhere?",
        a: "Splitting is performed in your browser with pdf-lib; the selected PDF is not sent to our server for processing.",
      },
      {
        q: "What's the largest PDF I can split?",
        a: "There is no fixed file size limit. Very large or complex PDFs may still be limited by your device's available memory.",
      },
      {
        q: "Can I split a password-protected PDF?",
        a: "No, this tool does not handle encrypted PDFs. Please remove the password first using your PDF reader.",
      },
    ],
    howToSteps: [
      "Upload a PDF file using drag-and-drop or the file picker.",
      "Enter page ranges in the format 1-3, 5, 7-9.",
      "Click Split PDF and wait for processing.",
      "Download each resulting PDF, or grab them all as a ZIP.",
    ],
    accent: "#8b5cf6",
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Text — Word-compatible .doc",
    description:
      "Extract selectable PDF text into a Word-compatible .doc file in your browser. Text-focused output; original page layout is not preserved.",
    category: "Conversion",
    privacyMode: "browser",
    keywords: [
      "pdf to word",
      "pdf to doc",
      "extract text from pdf",
      "convert pdf to editable",
      "pdf text extractor",
    ],
    longDescription:
      "PDF to Text uses the pdfjs-dist library to extract text content from your PDF and packages it as a .doc file you can open in Microsoft Word, Google Docs, or LibreOffice. It extracts text, not the original page design: tables, columns, images, and complex layouts may change or be omitted.",
    notice:
      "This tool extracts text into a Word-compatible .doc file; it does not preserve the original PDF layout, images, or complex tables.",
    faqs: [
      {
        q: "Will the layout be preserved?",
        a: "Text is extracted line by line. Tables, images, and complex layouts may not match the original perfectly. The tool prioritizes text accuracy over visual fidelity.",
      },
      {
        q: "Is this PDF to Text tool free?",
        a: "Yes. Conversion runs in your browser, and the selected files are not sent to our server for conversion.",
      },
      {
        q: "Can I convert scanned PDFs?",
        a: "No. Scanned PDFs contain images of text, not actual text. You would need an OCR tool to extract text from scans.",
      },
      {
        q: "What output format is used?",
        a: "We generate a .doc file (Word 97-2003) which opens in Microsoft Word, Google Docs, and LibreOffice. The format is HTML-based so it's lightweight and universally compatible.",
      },
    ],
    howToSteps: [
      "Drop a PDF file into the upload area or click to browse.",
      "Click Convert to Word and wait for text extraction to complete.",
      "Preview the extracted text in the panel.",
      "Download the resulting .doc file to edit in Word or Google Docs.",
    ],
    accent: "#3b82f6",
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    description:
      "Convert JPG, PNG, and WebP images into a single PDF document. Reorder, set page size, and download instantly.",
    category: "PDF",
    privacyMode: "browser",
    keywords: [
      "image to pdf",
      "jpg to pdf",
      "png to pdf",
      "convert images to pdf",
      "picture to pdf",
    ],
    longDescription:
      "Turn one or more images into a single PDF with our Image to PDF tool. Choose page size (A4, Letter, or fit-to-image), reorder pages by dragging, and download the result. The selected images are processed in your browser with pdf-lib and are not sent to our server for conversion.",
    faqs: [
      {
        q: "Which image formats are supported?",
        a: "JPG, PNG, and WebP are supported. Each image becomes one page in the output PDF.",
      },
      {
        q: "Can I choose the page size?",
        a: "Yes. Choose A4, US Letter, or fit-to-image. The image is centered on the chosen page size.",
      },
      {
        q: "Are my images uploaded to a server?",
        a: "This tool processes the selected images in your browser using pdf-lib; the image contents are not sent to our server for processing.",
      },
      {
        q: "Is there a file size limit?",
        a: "There is no fixed file size limit. Very large images or batches may still be limited by your device's available memory.",
      },
    ],
    howToSteps: [
      "Drag and drop images into the upload area, or click to browse.",
      "Reorder images by dragging them in the list.",
      "Choose a page size (A4, Letter, or fit-to-image).",
      "Click Create PDF and download the result.",
    ],
    accent: "#06b6d4",
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    description:
      "Reduce PDF file size by rasterizing each page to an image in your browser. The output text is no longer selectable or searchable.",
    category: "PDF",
    privacyMode: "browser",
    keywords: [
      "compress pdf",
      "reduce pdf size",
      "pdf compressor",
      "shrink pdf",
      "optimize pdf",
    ],
    longDescription:
      "Compress PDF reduces a file's size by rasterizing each page to a JPEG image at a resolution you choose. The new PDF contains page images, so its text is no longer selectable or searchable. This is most effective on PDFs that contain large embedded images. Text-heavy PDFs may not compress as dramatically. All processing happens locally with pdf-lib and pdfjs-dist.",
    notice:
      "Important: pages are rasterized into images. Text in the compressed PDF will no longer be selectable or searchable; keep your original file.",
    faqs: [
      {
        q: "How does PDF compression work?",
        a: "Each page is rendered to a JPEG image at the chosen quality, then reassembled into a new PDF. This dramatically reduces size for image-heavy PDFs.",
      },
      {
        q: "Will text still be searchable?",
        a: "No. After compression, the text in the PDF is part of an image and is no longer selectable or searchable. Use this for archival copies only.",
      },
      {
        q: "Are my PDFs uploaded anywhere?",
        a: "Compression runs in your browser using pdfjs-dist and pdf-lib; the selected PDF contents are not sent to our server for processing.",
      },
      {
        q: "What quality should I choose?",
        a: "Medium (72 DPI) is good for screen viewing. High (150 DPI) balances quality and size. Use High if you need to print the result.",
      },
    ],
    howToSteps: [
      "Upload a PDF file using drag-and-drop or the file picker.",
      "Choose a quality level (Low, Medium, or High).",
      "Click Compress PDF and wait for processing.",
      "Compare the original and compressed sizes, then download.",
    ],
    accent: "#ec4899",
  },
  {
    slug: "webp-to-png",
    name: "WebP to PNG",
    description:
      "Convert WebP images to PNG format with full transparency support. Fast, free, and 100% browser-based.",
    category: "Conversion",
    privacyMode: "browser",
    keywords: [
      "webp to png",
      "convert webp",
      "webp converter",
      "webp to png online",
    ],
    longDescription:
      "WebP is great for the web, but some applications still need PNG. Our WebP to PNG converter preserves transparency and runs entirely in your browser using the Canvas API. Convert a single image or a batch at once.",
    faqs: [
      {
        q: "Is transparency preserved?",
        a: "Yes. The PNG output preserves the alpha channel of the original WebP image.",
      },
      {
        q: "Are my images uploaded to a server?",
        a: "No. Conversion happens locally using the HTML Canvas API. Your images stay on your device.",
      },
      {
        q: "Can I convert multiple files at once?",
        a: "Yes. Drag in a batch of WebP files and download them all as PNGs, either individually or as a ZIP.",
      },
      {
        q: "Is there a file size limit?",
        a: "There is no fixed file size limit. Very large images may still be constrained by your device's available memory.",
      },
    ],
    howToSteps: [
      "Drag and drop WebP files into the upload area, or click to browse.",
      "Click Convert to PNG.",
      "Wait for the progress bar to complete.",
      "Download each PNG individually or all together as a ZIP.",
    ],
    accent: "#14b8a6",
  },
  {
    slug: "png-to-jpg",
    name: "PNG to JPG",
    description:
      "Convert PNG images to JPG format to reduce file size. Choose a background color for transparent areas.",
    category: "Conversion",
    privacyMode: "browser",
    keywords: [
      "png to jpg",
      "convert png",
      "png converter",
      "png to jpeg",
    ],
    longDescription:
      "PNG to JPG converts your PNG images into smaller JPG files. Because JPG doesn't support transparency, you can choose a background color to fill transparent areas. Runs entirely in your browser using the Canvas API.",
    faqs: [
      {
        q: "What happens to transparent areas?",
        a: "You can choose a background color (white by default) that fills transparent areas before saving as JPG.",
      },
      {
        q: "Are my images uploaded anywhere?",
        a: "Conversion uses the Canvas API in your browser; the selected images are not sent to our server for conversion.",
      },
      {
        q: "Can I convert multiple PNGs at once?",
        a: "Yes. Batch conversion is supported — drop in multiple files and download them all as a ZIP.",
      },
      {
        q: "Will the output quality match the original?",
        a: "JPG is a lossy format, so there may be slight quality loss. You can adjust the quality slider to balance size and clarity.",
      },
    ],
    howToSteps: [
      "Drag and drop PNG files into the upload area, or click to browse.",
      "Choose a background color for transparent areas.",
      "Optionally adjust the JPG quality slider.",
      "Click Convert and download each JPG or all as a ZIP.",
    ],
    accent: "#f97316",
  },
  {
    slug: "jpg-to-webp",
    name: "JPG to WebP",
    description:
      "Convert JPG images to modern WebP format for smaller file sizes and better web performance.",
    category: "Conversion",
    privacyMode: "browser",
    keywords: [
      "jpg to webp",
      "convert to webp",
      "jpeg to webp",
      "webp converter",
    ],
    longDescription:
      "WebP files can be smaller than JPGs at comparable visual quality, depending on the image and settings. Our JPG to WebP converter uses the Canvas API in your browser.",
    faqs: [
      {
        q: "How much smaller will WebP be than JPG?",
        a: "WebP is typically 25-35% smaller than JPG at equivalent visual quality, depending on the image content.",
      },
      {
        q: "Are my images uploaded to a server?",
        a: "Conversion happens with the Canvas API in your browser; the selected files are not sent to our server for conversion.",
      },
      {
        q: "Can I batch convert multiple JPGs?",
        a: "Yes. Drop in multiple JPG files and download them all as WebP, either individually or as a ZIP.",
      },
      {
        q: "Does every browser support WebP?",
        a: "All modern browsers (Chrome, Edge, Firefox, Safari 14+) support WebP. If you're targeting very old browsers, consider keeping a JPG fallback.",
      },
    ],
    howToSteps: [
      "Drag and drop JPG files into the upload area, or click to browse.",
      "Adjust the quality slider (1-100) if needed.",
      "Click Convert to WebP.",
      "Download each WebP file individually or all as a ZIP.",
    ],
    accent: "#22c55e",
  },
  // ─── YouTube Creator Tools ───────────────────────────────────────
  {
    slug: "youtube-thumbnail-downloader",
    name: "YouTube Thumbnail Downloader",
    description:
      "Download HD thumbnails from any YouTube video in one click. Supports maxres, SD, HQ, and MQ resolutions — no sign-up, no watermark.",
    category: "YouTube",
    privacyMode: "youtube-thumbnails",
    keywords: [
      "youtube thumbnail downloader",
      "download youtube thumbnail",
      "youtube thumbnail grabber",
      "save youtube thumbnail hd",
      "get youtube thumbnail",
    ],
    longDescription:
      "Paste a YouTube URL to retrieve public thumbnails at available resolutions. The tool requests video metadata and thumbnail images directly from YouTube.",
    faqs: [
      {
        q: "Is this thumbnail downloader free?",
        a: "Yes, completely free with no sign-up, no watermark, and no limits on how many thumbnails you download.",
      },
      {
        q: "Which resolutions can I download?",
        a: "We check maxresdefault (1280×720), sddefault (640×480), hqdefault (480×360), mqdefault (320×180), and default (120×90). Not all videos have maxres — older uploads may only go up to SD.",
      },
      {
        q: "Can I use downloaded thumbnails commercially?",
        a: "Thumbnails are owned by the video creator. Downloading for research, inspiration, or personal use is fine, but you should not republish someone else's thumbnail without permission.",
      },
      {
        q: "Why does maxresdefault sometimes fail?",
        a: "Not all videos have a maxres thumbnail. Videos uploaded before 2013 or those with low-quality source files may not have a 1280×720 version. We automatically fall back to the next best resolution.",
      },
    ],
    howToSteps: [
      "Copy the YouTube video URL from your browser's address bar or the share button.",
      "Paste the URL into the input field above.",
      "Click Fetch Thumbnails and wait for the preview to load.",
      "Click Download on the resolution you want — the image saves directly to your device.",
    ],
    accent: "#ff0000",
  },
  {
    slug: "youtube-thumbnail-resizer",
    name: "YouTube Thumbnail Resizer",
    description:
      "Resize and crop your thumbnail to YouTube's required 1280×720 with a safe-zone overlay so text isn't cut off on mobile.",
    category: "YouTube",
    privacyMode: "browser",
    keywords: [
      "youtube thumbnail resizer",
      "resize youtube thumbnail",
      "thumbnail crop 1280x720",
      "youtube thumbnail safe zone",
      "thumbnail size converter",
    ],
    longDescription:
      "YouTube requires thumbnails to be exactly 1280×720 pixels. Our resizer crops your image to that exact size while showing a safe-zone overlay — the area where text and faces won't be cut off by YouTube's player UI on mobile devices. Drag to reposition, then download a production-ready thumbnail.",
    faqs: [
      {
        q: "What is the YouTube thumbnail safe zone?",
        a: "YouTube's player overlays a timestamp and progress bar at the bottom of thumbnails, and mobile interfaces can crop the edges. The safe zone is roughly the central 80% of the image where important text and faces should be placed.",
      },
      {
        q: "What size should a YouTube thumbnail be?",
        a: "1280×720 pixels (16:9 aspect ratio), under 2 MB, in JPG, PNG, BMP, or GIF format. Our tool crops to exactly 1280×720.",
      },
      {
        q: "Can I upload any image format?",
        a: "Yes, we support JPG, PNG, WebP, and GIF (first frame). The output is always a PNG to preserve quality.",
      },
      {
        q: "Are my images uploaded to a server?",
        a: "Cropping and resizing happen in your browser using the Canvas API. The selected image is not sent to our server for processing.",
      },
    ],
    howToSteps: [
      "Upload an image by dragging it into the drop zone or clicking to browse.",
      "Drag the image to reposition it within the 1280×720 crop frame.",
      "Toggle the safe-zone overlay to see where text won't be cut off.",
      "Click Download to save the cropped thumbnail as a PNG.",
    ],
    accent: "#ff0033",
  },
  {
    slug: "youtube-tags-extractor",
    name: "YouTube Tags Extractor",
    description:
      "Check a YouTube video's public page for tags. Its URL is sent to our server to fetch the page; tags may be unavailable.",
    category: "YouTube",
    privacyMode: "server-video-url",
    keywords: [
      "youtube tags extractor",
      "extract youtube tags",
      "youtube keyword extractor",
      "see youtube video tags",
      "youtube tag finder",
    ],
    longDescription:
      "Our extractor sends the video URL to our server, which fetches the public YouTube video page and reads its keyword metadata. The server receives the URL, not a video or file upload.",
    faqs: [
      {
        q: "How does the tags extractor work?",
        a: "The tool sends the video URL to our server. The server validates it, fetches the public YouTube page without following redirects, and reads its keyword metadata.",
      },
      {
        q: "Why are no tags showing for some videos?",
        a: "Some creators don't add tags, and YouTube has de-emphasized them in recent years. If the keyword meta tag is empty, the video simply has no tags.",
      },
      {
        q: "Do YouTube tags still matter for SEO?",
        a: "YouTube has stated tags play a minimal role for search, but they can help with disambiguation and related-video suggestions. Title, description, and engagement matter far more.",
      },
      {
        q: "Can I copy the tags for my own video?",
        a: "You can copy them, but blindly copying a competitor's tags won't help. Use them as research to understand the topic landscape, then craft your own relevant tags.",
      },
    ],
    howToSteps: [
      "Copy a YouTube video URL from the address bar or share button.",
      "Paste it into the input field above.",
      "Click Extract Tags and wait a few seconds for the page to be fetched.",
      "Copy individual tags or all of them at once to your clipboard.",
    ],
    accent: "#cc0000",
  },
  {
    slug: "youtube-title-generator",
    name: "YouTube Title Generator",
    description:
      "Generate SEO-optimized YouTube titles from your topic. Includes a live character counter so you stay under 100 characters.",
    category: "YouTube",
    privacyMode: "browser",
    keywords: [
      "youtube title generator",
      "generate youtube titles",
      "youtube title ideas",
      "seo title generator youtube",
      "youtube title optimizer",
    ],
    longDescription:
      "A great title is the single biggest factor in YouTube click-through rate. Our generator takes your topic and produces proven title patterns — how-to, listicle, question, curiosity gap, and more. Each title includes a live character counter so you stay within YouTube's 100-character display limit.",
    faqs: [
      {
        q: "How does the title generator work?",
        a: "We use proven title templates backed by YouTube CTR research. Enter your topic and we generate variations using patterns like 'How to X', 'X Tips for Y', 'The Truth About X', and more.",
      },
      {
        q: "What's the ideal YouTube title length?",
        a: "YouTube displays up to 100 characters in search results and 70 on mobile. Aim for 60-70 characters to ensure the full title is visible. Our counter turns red past 100.",
      },
      {
        q: "Are the generated titles unique?",
        a: "The templates produce combinations from your input. You should always review and customize the title to match your specific video content and brand voice.",
      },
      {
        q: "Can I use this for free?",
        a: "Yes, completely free with no sign-up. Generate as many titles as you need.",
      },
    ],
    howToSteps: [
      "Type your video topic or main keyword into the input field.",
      "Click Generate Titles to produce variations using proven templates.",
      "Review the character count — green means good, red means too long.",
      "Click any title to copy it to your clipboard.",
    ],
    accent: "#e60000",
  },
  {
    slug: "youtube-description-generator",
    name: "YouTube Description Generator",
    description:
      "Generate structured YouTube descriptions with timestamps, social links, and hashtags. SEO-ready in seconds.",
    category: "YouTube",
    privacyMode: "browser",
    keywords: [
      "youtube description generator",
      "generate youtube description",
      "youtube description template",
      "youtube description with timestamps",
      "seo description youtube",
    ],
    longDescription:
      "YouTube's algorithm reads your description for SEO, and viewers scan it for navigation. Our generator produces a structured description with a hook, summary, timestamp chapters, social links, and hashtags — all editable. Just fill in your video details and copy the result.",
    faqs: [
      {
        q: "Why do YouTube descriptions matter?",
        a: "The first 125 characters appear in search results and influence click-through. The full description is parsed for keywords that help your video rank. Timestamps also create chapters in the player.",
      },
      {
        q: "How do timestamps work?",
        a: "Add lines starting with a time (e.g. 0:00 Intro, 1:23 Main Topic) and YouTube automatically creates chapter markers in the video player. Our generator formats these correctly for you.",
      },
      {
        q: "How long should a YouTube description be?",
        a: "YouTube allows up to 5,000 characters. Aim for at least 250 characters with a clear summary, links, and relevant keywords. The first two lines matter most.",
      },
      {
        q: "Should I include hashtags?",
        a: "Yes — the first three hashtags appear above the title on mobile. Use relevant, specific hashtags (not generic ones like #youtube). Our generator includes a hashtag section.",
      },
    ],
    howToSteps: [
      "Enter your video title, topic, and a one-sentence summary.",
      "Add timestamp entries (e.g. 0:00 Intro, 2:15 Tips, 5:30 Outro).",
      "Fill in your social media links and channel description.",
      "Click Copy Description and paste it into YouTube Studio.",
    ],
    accent: "#ff1a1a",
  },
  {
    slug: "youtube-hashtag-generator",
    name: "YouTube Hashtag Generator",
    description:
      "Generate relevant YouTube hashtags for your niche or topic. Boost discoverability with researched tag combinations.",
    category: "YouTube",
    privacyMode: "browser",
    keywords: [
      "youtube hashtag generator",
      "generate youtube hashtags",
      "youtube tags generator",
      "youtube hashtag ideas",
      "hashtag generator for youtube",
    ],
    longDescription:
      "Hashtags help YouTube understand your video's topic and surface it in related content. Our generator takes your niche or topic and produces a mix of broad, niche, and long-tail hashtags. The first three hashtags you use appear above your title on mobile, so choose wisely.",
    faqs: [
      {
        q: "How many hashtags should I use on YouTube?",
        a: "YouTube allows up to 60 hashtags in the description, but more than 15 can be flagged as spam. We recommend 5-10 highly relevant hashtags. The first three appear above the title.",
      },
      {
        q: "Do hashtags help with YouTube SEO?",
        a: "Yes, but modestly. They help YouTube group your video with related content. They're most useful for trending or niche topics. Overusing generic hashtags can hurt.",
      },
      {
        q: "Should I use the same hashtags on every video?",
        a: "No. Tailor hashtags to each specific video's topic. Repeating the same tags across unrelated videos can be seen as tag stuffing.",
      },
      {
        q: "Are these hashtags researched or random?",
        a: "We generate hashtags by combining your topic with proven patterns (#howto, #tutorial, #2025, niche modifiers). Always review and select the ones most relevant to your specific content.",
      },
    ],
    howToSteps: [
      "Enter your video topic, niche, or main keyword.",
      "Click Generate Hashtags to produce a list of relevant tags.",
      "Click any hashtag to copy it, or use Copy All.",
      "Paste 5-10 of the most relevant hashtags into your video description.",
    ],
    accent: "#cc0033",
  },
  {
    slug: "youtube-money-calculator",
    name: "YouTube Money Calculator",
    description:
      "Estimate YouTube earnings based on views, niche, and CPM. See potential ad revenue across 16 content categories.",
    category: "YouTube",
    privacyMode: "browser",
    keywords: [
      "youtube money calculator",
      "youtube earnings calculator",
      "youtube revenue estimator",
      "youtube cpm calculator",
      "how much youtube pays",
    ],
    longDescription:
      `Wondering how much a YouTube channel earns? Our calculator estimates ad revenue based on monthly views and content niche. We use CPM ranges from ${Object.keys(CPM_RANGES).length} categories — from finance ($${highestCpm.low}-${highestCpm.high} CPM) to music ($${lowestCpm.low}-${lowestCpm.high} CPM) — and apply a ${CREATOR_SHARE * 100}% creator share. Estimates depend on geography, watch time, ad format, and season.`,
    faqs: [
      {
        q: "How accurate is the YouTube money calculator?",
        a: `Our estimates apply a ${CREATOR_SHARE * 100}% creator share to niche CPM ranges. Actual earnings vary based on audience geography, watch time, ad format, and season. Sponsorships and merchandise are not included.`,
      },
      {
        q: "What is CPM?",
        a: "CPM (cost per mille) is what advertisers pay per 1,000 ad impressions. RPM (revenue per mille) is what the creator actually receives after YouTube's cut. Our calculator factors in both.",
      },
      {
        q: "Does this include sponsorships or merchandise?",
        a: "No. This calculator only estimates ad revenue. Sponsorships, channel memberships, Super Chat, and merchandise can add significantly to a creator's income — often more than ads for larger channels.",
      },
      {
        q: "Which niches pay the most on YouTube?",
        a: "Finance, investing, and business/tech typically have the highest CPMs ($15-35). Entertainment and music have the lowest ($1-4). Educational content sits in the middle.",
      },
    ],
    howToSteps: [
      "Enter the channel's monthly views (e.g. 500000).",
      "Select the content niche that best matches the channel.",
      "Click Calculate to see the estimated monthly earnings range.",
      "Review the low, mid, and high estimates based on niche CPM data.",
    ],
    accent: "#00cc44",
  },
  {
    slug: "youtube-thumbnail-tester",
    name: "YouTube Thumbnail Tester",
    description:
      "Preview your thumbnail at real-world sizes — mobile feed, desktop search, TV, and tiny preview. See it as viewers will.",
    category: "YouTube",
    privacyMode: "youtube-thumbnail-preview",
    keywords: [
      "youtube thumbnail tester",
      "preview youtube thumbnail",
      "thumbnail size preview",
      "youtube thumbnail mockup",
      "test thumbnail mobile desktop",
    ],
    longDescription:
      "A thumbnail that looks great full-size might be unreadable as a 120px preview on mobile. Our tester shows your thumbnail at the actual sizes YouTube uses — mobile feed, desktop search results, sidebar suggestions, and the tiny notification preview — so you can verify text is legible and faces are visible before publishing.",
    faqs: [
      {
        q: "Which sizes does the tester show?",
        a: "We render your thumbnail at the real-world display sizes YouTube uses: mobile feed (210×118), desktop search (246×138), sidebar suggestion (168×94), TV (1280×720), and notification (120×68).",
      },
      {
        q: "Why should I test my thumbnail at different sizes?",
        a: "Over 70% of YouTube watch time is on mobile. If your title text or face isn't legible at 210 pixels wide, viewers will scroll past. Testing helps you design for the smallest size first.",
      },
      {
        q: "Are my images uploaded anywhere?",
        a: "If you enter a YouTube URL, your browser requests the public thumbnail images directly from YouTube. If you select an image file, it is previewed in your browser and is not sent to our server.",
      },
      {
        q: "Can I test a thumbnail from an existing YouTube video?",
        a: "Yes — paste a YouTube URL and we'll fetch the video's current thumbnail for testing. Or upload your own image to test before publishing.",
      },
    ],
    howToSteps: [
      "Upload an image or paste a YouTube URL to load a thumbnail.",
      "Scroll through the preview cards showing different display sizes.",
      "Check that text is legible and faces are visible at the smallest sizes.",
      "Redesign if needed and re-test until the thumbnail works at every size.",
    ],
    accent: "#ff3333",
  },
  {
    slug: "youtube-channel-id-finder",
    name: "YouTube Channel ID Finder",
    description:
      "Find any YouTube channel ID from a video URL, handle, or channel link. Get the UC... ID instantly for APIs and integrations.",
    category: "YouTube",
    privacyMode: "youtube-and-proxy",
    keywords: [
      "youtube channel id finder",
      "find youtube channel id",
      "get youtube channel id",
      "youtube channel id extractor",
      "youtube uc id",
    ],
    longDescription:
      "Need a channel ID for the YouTube API, RSS feeds, or third-party tools? Video lookups send the video URL to YouTube's public oEmbed endpoint; handle lookups send the channel URL to the AllOrigins proxy. Direct channel-ID links are parsed in your browser.",
    faqs: [
      {
        q: "What is a YouTube channel ID?",
        a: "It's a unique 24-character identifier starting with 'UC' (e.g. UCxxxxxxxxxxxxxxxxxxxxxx). YouTube uses it internally for API calls, RSS feeds, and analytics integrations.",
      },
      {
        q: "Can I find a channel ID from a @handle?",
        a: "Yes. The tool sends the channel URL to the AllOrigins proxy, which fetches the public channel page so the ID can be extracted.",
      },
      {
        q: "Can I find a channel ID from a video URL?",
        a: "Yes. The tool sends the video URL directly to YouTube's public oEmbed endpoint, then extracts the channel ID from the response.",
      },
      {
        q: "Is this free?",
        a: "Yes, completely free with no sign-up and no API key. We use YouTube's public oEmbed endpoint and public channel pages.",
      },
    ],
    howToSteps: [
      "Copy a YouTube URL — either a video URL or a channel/handle URL.",
      "Paste it into the input field above.",
      "Click Find Channel ID.",
      "Copy the channel ID to your clipboard for use in APIs or tools.",
    ],
    accent: "#ff0066",
  },
  {
    slug: "youtube-timestamp-link-generator",
    name: "YouTube Timestamp Link Generator",
    description:
      "Create shareable YouTube links that start at a specific timestamp. Skip intros and link directly to the good part.",
    category: "YouTube",
    privacyMode: "browser",
    keywords: [
      "youtube timestamp link generator",
      "youtube link with timestamp",
      "share youtube video at specific time",
      "youtube t parameter link",
      "deep link youtube video",
    ],
    longDescription:
      "Want to share a YouTube video starting at a specific moment? Our generator creates a timestamped link (youtu.be/VIDEO_ID?t=123s) from any video URL and time. Perfect for sharing the relevant part of a long podcast, tutorial, or stream without making viewers scrub.",
    faqs: [
      {
        q: "How do YouTube timestamp links work?",
        a: "YouTube supports a ?t= parameter on video URLs that specifies the start time in seconds. For example, youtu.be/dQw4w9WgXcQ?t=43 starts the video at 43 seconds.",
      },
      {
        q: "Can I use minutes and seconds instead of counting seconds?",
        a: "Yes. Enter '1:30' and we'll convert it to 90 seconds automatically. You can also enter pure seconds (90) or hours:minutes:seconds (1:02:03).",
      },
      {
        q: "Do timestamp links work on mobile?",
        a: "Yes. The youtu.be short URL with ?t= works in the YouTube mobile app and in mobile browsers. The app opens and starts at the specified time.",
      },
      {
        q: "Can I create multiple timestamp links at once?",
        a: "Yes — add as many timestamps as you need and we'll generate a link for each. Great for creating a table of contents for a long video.",
      },
    ],
    howToSteps: [
      "Paste a YouTube video URL (or just the video ID).",
      "Enter the timestamp you want to link to (e.g. 1:30 or 90).",
      "Click Generate Link to create the shareable URL.",
      "Copy the link and share it anywhere — it opens at your chosen time.",
    ],
    accent: "#ff0099",
  },
  {
    slug: "remove-exif",
    name: "Remove EXIF Data",
    description:
      "Strip EXIF, GPS location, camera details, and privacy metadata from JPG, PNG, and WebP images in your browser.",
    category: "Image",
    privacyMode: "browser",
    keywords: [
      "remove exif",
      "exif remover",
      "remove metadata from photo",
      "strip gps from image",
      "delete photo metadata",
      "clean exif online",
      "remove photo location",
    ],
    longDescription:
      "Protect your personal privacy by stripping hidden EXIF metadata from photos before sharing them online. Modern smartphone photos contain sensitive data like exact GPS coordinates, date taken, camera make and model, device serial numbers, and software version. Our Remove EXIF tool extracts and displays all embedded metadata, alerts you if GPS coordinates are found, and cleanly wipes it all directly in your browser without uploading your files.",
    faqs: [
      {
        q: "What metadata is removed from my photos?",
        a: "All EXIF, GPS coordinates (latitude, longitude, altitude), camera make/model, date & time, lens info, software tags, thumbnail data, and device serial numbers are completely stripped.",
      },
      {
        q: "Are my photos uploaded to a server?",
        a: "Inspection and stripping use HTML5 Canvas and WebAssembly in your browser; the selected photos are not sent to our server for processing.",
      },
      {
        q: "Will removing EXIF reduce photo quality?",
        a: "No. You can choose Lossless PNG or high-quality JPG (95-100%) to preserve full visual fidelity while stripping all hidden tracking tags.",
      },
      {
        q: "Can I batch process multiple images?",
        a: "Yes. Drag and drop multiple photos to clean them all at once, then download them individually or as a single ZIP archive.",
      },
    ],
    howToSteps: [
      "Upload one or more images using drag-and-drop or the file picker.",
      "Review the detected EXIF metadata and GPS location tags.",
      "Select your output format and quality settings.",
      "Click Remove EXIF and download your cleaned, privacy-safe photos.",
    ],
    accent: "#6366f1",
  },
  {
    slug: "pdf-to-image",
    name: "PDF to Image",
    description:
      "Convert PDF pages to high-resolution JPG, PNG, or WebP images in up to 300 DPI print quality in your browser.",
    category: "PDF",
    privacyMode: "browser",
    keywords: [
      "pdf to image",
      "pdf to jpg",
      "pdf to png",
      "convert pdf to image high quality",
      "pdf to high resolution image",
      "pdf to 300 dpi image",
      "extract pdf pages as images",
    ],
    longDescription:
      "Convert every page of a PDF document into high-resolution, crystal-clear images. Select from standard 72 DPI up to ultra 300 DPI / 400 DPI print quality, or use custom scaling for razor-sharp text and vector graphics. Choose between lossless PNG, JPEG, or modern WebP, preview all rendered pages in real time, and download single pages or the entire document as a ZIP file.",
    faqs: [
      {
        q: "What resolution / DPI can I convert PDFs to?",
        a: "You can choose from Screen (72 DPI), Balanced (150 DPI), Super HD (200 DPI), Ultra Print (300 DPI), or Maximum 4K (400 DPI). You can also set a custom scale multiplier up to 5x.",
      },
      {
        q: "Which image formats are supported?",
        a: "You can export pages as lossless PNG (best for text and diagrams), high-quality JPG, or modern WebP.",
      },
      {
        q: "Can I convert only specific pages?",
        a: "Yes. Enter a page range like 1-3, 5 to convert selected pages, or leave blank to convert all pages in the PDF.",
      },
      {
        q: "Are my PDF files uploaded anywhere?",
        a: "Conversion uses pdfjs-dist in your browser; the selected PDF contents are not sent to our server for conversion.",
      },
    ],
    howToSteps: [
      "Upload a PDF document using drag-and-drop or the file browser.",
      "Choose your desired resolution (e.g. Ultra Print 300 DPI) and output format (PNG, JPG, or WebP).",
      "Optionally specify a page range.",
      "Click Convert PDF to Images and download your high-quality images individually or as a ZIP.",
    ],
    accent: "#0ea5e9",
  },
];

/** Site-wide config used for metadata, sitemap, and JSON-LD */
export const SITE_CONFIG = {
  name: "Convaudit",
  title: "Images, PDFs and YouTube Creator Tools",
  description:
    "Free tools for images, PDFs and YouTube creator tasks. Processing and data sharing vary by tool; see each tool's privacy badge.",
  url: "https://convaudit.com",
  adsenseClient: (process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "").trim(),
  analyticsProvider:
    "Google Analytics 4, Vercel Analytics, and Vercel Speed Insights",
  analyticsMeasurementId: "G-MDR2NP5CJ3",
};

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
