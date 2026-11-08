import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";
import { SITE_CONFIG, TOOLS } from "@/lib/tools";

const CORE_TOOL_SLUGS = [
  "compress-image",
  "remove-background",
  "heic-to-jpg",
  "merge-pdf",
  "split-pdf",
  "rotate-pdf",
  "pdf-to-word",
  "image-to-pdf",
  "compress-pdf",
  "webp-to-png",
  "png-to-jpg",
  "jpg-to-webp",
  "youtube-thumbnail-downloader",
  "youtube-thumbnail-resizer",
  "youtube-tags-extractor",
  "youtube-title-generator",
  "youtube-description-generator",
  "youtube-hashtag-generator",
];

export async function GET() {
  const toolsBySlug = new Map(TOOLS.map((tool) => [tool.slug, tool]));
  const coreTools = CORE_TOOL_SLUGS.flatMap((slug) => {
    const tool = toolsBySlug.get(slug);
    return tool
      ? [
          `- [${tool.name}](${SITE_CONFIG.url}/tools/${tool.slug}): ${tool.description}`,
        ]
      : [];
  });
  const contentGuides = getAllPosts()
    .slice(0, 10)
    .map(
      (post) =>
        `- [${post.title}](${SITE_CONFIG.url}/blog/${post.slug}): ${post.description}`,
    );

  const body = `# Convaudit

> Convaudit provides browser-based image, PDF, and file-conversion tools, plus YouTube creator utilities. Image and PDF files are processed in the browser; YouTube tools may send URLs to Convaudit, YouTube, or a third-party proxy as described on each tool page.

## Core Tools
${coreTools.join("\n")}

## Content & Guides
${contentGuides.join("\n")}

## About & Privacy
- [About Convaudit](${SITE_CONFIG.url}/about): Meet the founder, learn the site's mission, and review how each tool handles input.
- [Privacy Policy](${SITE_CONFIG.url}/privacy): Read how files, URLs, analytics, and advertising data are handled.
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
