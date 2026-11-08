import type { Metadata } from "next";
import { ToolsOrganizer } from "@/components/tools/ToolsOrganizer";
import { buildStaticPageMetadata } from "@/lib/seo";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = buildStaticPageMetadata({
  title: `Compress, Convert & Create: ${TOOLS.length} Free Online Tools`,
  description:
    "Explore 27+ Free online tools: Image tools, PDF tools, YouTube and social calculators. Files process locally for Privacy - no uploads or sign-up. Access now.",
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
