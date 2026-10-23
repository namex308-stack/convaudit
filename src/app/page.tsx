import type { Metadata } from "next";
import { ToolsOrganizer } from "@/components/tools/ToolsOrganizer";
import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "Images, PDFs and YouTube Creator Tools",
  description:
    "22 free online tools for images, PDFs, and YouTube. Process image and PDF files in your browser with clear data-use details.",
  path: "/",
});

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <section aria-label="Browse tools" className="pt-6 sm:pt-10">
        <ToolsOrganizer />
      </section>
    </div>
  );
}
