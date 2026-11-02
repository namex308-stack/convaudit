import { NextResponse } from "next/server";
import { SITE_CONFIG, TOOLS } from "@/lib/tools";

const toolDetails = TOOLS.map(
  (tool) =>
    `- ${tool.name} (${tool.category}): ${tool.description}\n  Keywords: ${tool.keywords.join(", ")}`,
).join("\n");

export async function GET() {
  const body = `# Convaudit Full Overview

## Site summary
Convaudit provides browser-based tools for images, PDFs, file conversion, and YouTube creator tasks. Image and PDF files are processed in the browser and are not sent to Convaudit for processing. YouTube tools may request public data directly from YouTube or AllOrigins; the Tags Extractor sends a video URL to Convaudit's server to fetch public tags. See each tool's data-use badge for details.

## Site URLs
- Homepage: ${SITE_CONFIG.url}
- About: ${SITE_CONFIG.url}/about
- Blog: ${SITE_CONFIG.url}/blog
- Search: ${SITE_CONFIG.url}/search
- Privacy: ${SITE_CONFIG.url}/privacy
- Terms: ${SITE_CONFIG.url}/terms
- Sitemap: ${SITE_CONFIG.url}/sitemap.xml
- RSS: ${SITE_CONFIG.url}/rss.xml

## Tool inventory
${toolDetails}

## Editorial focus
Convaudit publishes practical guides and how-to content that explains file conversion, compression, PDF cleanup, and format compatibility. The site emphasizes fast browser-based workflows, reader-friendly explanations, and transparent privacy expectations.
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
