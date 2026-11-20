import { NextRequest } from "next/server";
import { getToolBySlug, TOOLS } from "@/lib/tools";

const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";

function markdownResponse(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": MARKDOWN_CONTENT_TYPE,
    },
  });
}

function getToolMarkdown(slug: string): string | undefined {
  const tool = getToolBySlug(slug);
  if (!tool) return undefined;

  const howTo = tool.howToSteps
    .map((step, index) => `${index + 1}. ${step}`)
    .join("\n");
  const faqs = tool.faqs.map(({ q, a }) => `### ${q}\n\n${a}`).join("\n\n");

  return `# ${tool.name}

${tool.description}

${tool.longDescription}

${tool.notice ? `\n> ${tool.notice}\n` : ""}

## How to use

${howTo}

## Frequently asked questions

${faqs}
`;
}

export function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("path") ?? "/";

  if (pathname === "/") {
    const tools = TOOLS.map(
      (tool) => `- [${tool.name}](/tools/${tool.slug}): ${tool.description}`,
    ).join("\n");

    return markdownResponse(`# Convaudit

Free online tools for images, PDFs, file conversion, and YouTube creator tasks. Many tools process files in your browser without uploading them.

## Tools

${tools}
`);
  }

  const match = pathname.match(/^\/tools\/([^/]+)\/?$/);
  const markdown = match ? getToolMarkdown(match[1]) : undefined;

  if (!markdown) {
    return markdownResponse("# Not found\n", 404);
  }

  return markdownResponse(markdown);
}
