import type { Metadata } from "next";
import { ToolsOrganizer } from "@/components/tools/ToolsOrganizer";
import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "Images, PDFs and YouTube Creator Tools",
  description:
    "Free tools for images, PDFs and YouTube creator tasks. Check each tool's badge to see where its data is processed.",
  path: "/",
});

export default function HomePage() {
  return (
    <main id="tools" className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
      <section className="mb-10 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-background to-background p-6 shadow-sm sm:p-8">
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary">
            Tool-specific data handling
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Free tools for creators, designers, and everyday work.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Many image and PDF tools process files in your browser. Some YouTube tools request public data from YouTube, a third-party proxy, or our server. Check each tool&apos;s data-use badge for details.
          </p>
        </div>
      </section>

      <section aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="mb-5 text-2xl font-semibold tracking-tight">
          Browse image, PDF, and YouTube tools
        </h2>
        <ToolsOrganizer />
      </section>
    </main>
  );
}
