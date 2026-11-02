import { NextResponse } from "next/server";
import { SITE_CONFIG, TOOLS } from "@/lib/tools";

const toolSummary = TOOLS.map(
  (tool) => `- ${tool.name}: ${tool.description}`,
).join("\n");

export async function GET() {
  const body = `# Convaudit

> Convaudit provides browser-based image, PDF, and file-conversion tools, plus YouTube creator utilities. Image and PDF files are processed in the browser; YouTube tools may send URLs to Convaudit, YouTube, or a third-party proxy as described on each tool page.

## Overview
- Website: ${SITE_CONFIG.url}
- About: ${SITE_CONFIG.url}/about
- Blog: ${SITE_CONFIG.url}/blog
- Privacy: ${SITE_CONFIG.url}/privacy
- Terms: ${SITE_CONFIG.url}/terms
- Search: ${SITE_CONFIG.url}/search
- Sitemap: ${SITE_CONFIG.url}/sitemap.xml
- RSS: ${SITE_CONFIG.url}/rss.xml

## Main tool categories
- Image optimization and compression
- PDF merging, splitting, conversion, and page extraction
- HEIC, JPG, PNG, WebP, and document conversion
- YouTube creator utilities and productivity helpers

## Core tools
${toolSummary}

## Content and discovery
Convaudit is designed to help users complete file and media tasks quickly in the browser without sign-up or account creation. The site publishes helpful guides and tool-specific explanations to improve discoverability for both search engines and AI assistants.
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
