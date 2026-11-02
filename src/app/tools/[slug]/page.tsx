import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TOOLS, SITE_CONFIG, getToolBySlug, type Tool } from "@/lib/tools";
import { buildToolMetadata } from "@/lib/seo";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolRenderer } from "@/components/tools/ToolRenderer";
import { JsonLd } from "@/components/JsonLd";

const compressImageFaqs = [
  {
    q: "Do my images leave my device during compression?",
    a: "No. Image compression happens on your device using browser-based processing; selected image files are not sent to our server for compression. The page still needs an internet connection to load, but the image contents remain in your browser during the compression operation.",
  },
  {
    q: "What does image compression cost?",
    a: "Nothing. The tool is free to use and does not require an account or subscription. Select images, adjust the quality setting, and download the compressed copies without paying. Your internet connection may be needed to load the page, but compression itself runs in your browser rather than sending the image files to a paid service.",
  },
  {
    q: "Which image formats can I compress?",
    a: "JPG, PNG, and WebP are the primary supported formats for compression. The tool also accepts most common image formats, but output behavior can depend on the source type and browser support. For reliable results, use JPG, PNG, or WebP images and check the downloaded file before sharing it.",
  },
  {
    q: "Will compressing an image reduce its quality?",
    a: "Yes. Lossy compression can reduce image detail, especially at lower quality settings. Use the quality control to balance smaller files against visual clarity, then preview the downloaded result. PNG may remain lossless depending on the source and output encoding, so compare the result rather than assuming every format behaves identically.",
  },
];

const compressImageSteps = [
  "Select one or more JPG, PNG, or WebP images.",
  "Set your preferred compression quality with the slider.",
  "Start compression and wait for the progress indicator to finish.",
  "Download each result individually or save them together as a ZIP file.",
];

function CompressImageCitationPage({ tool }: { tool: Tool }) {
  const lastUpdated = new Date();
  const date = lastUpdated.toISOString();
  const formattedDate = lastUpdated.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const headline = "Compress Images Online — Free, In-Browser";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    datePublished: date,
    dateModified: date,
    author: {
      "@type": "Organization",
      name: "Convaudit Team",
      url: `${SITE_CONFIG.url}/about`,
    },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: compressImageFaqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: {
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Runs locally in browser",
      "Compress JPG, PNG, and WebP images.",
      "Select one or more JPG, PNG, or WebP images.",
      "Set your preferred compression quality with the slider.",
    ],
  };

  return (
    <>
      <article className="mx-auto max-w-4xl px-5 py-10 sm:px-6 lg:px-8">
        <JsonLd data={articleSchema} />
        <JsonLd data={faqSchema} />
        <JsonLd data={softwareSchema} />

        <header>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {headline}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Compress Image reduces JPG, PNG, and WebP file sizes for easier
            sharing and storage. It is free, requires no account, and processes
            files locally in your browser, so image files are not sent to our
            server for compression. Add images, adjust quality, and download
            compressed files individually or together as a ZIP.
          </p>
        </header>

        <nav
          aria-label="Table of contents"
          className="mt-8 rounded-xl border border-border/70 bg-card p-5"
        >
          <p className="text-base font-semibold">On this page</p>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm">
            <li>
              <a className="text-primary underline-offset-4 hover:underline" href="#how-it-works">
                How does the free image compressor work?
              </a>
            </li>
            <li>
              <a className="text-primary underline-offset-4 hover:underline" href="#formats">
                Which image formats can you compress?
              </a>
            </li>
            <li>
              <a className="text-primary underline-offset-4 hover:underline" href="#privacy">
                Are images processed privately in your browser?
              </a>
            </li>
            <li>
              <a className="text-primary underline-offset-4 hover:underline" href="#comparison">
                How does this compare with online compressors?
              </a>
            </li>
            <li>
              <a className="text-primary underline-offset-4 hover:underline" href="#faq">
                What are common questions about image compression?
              </a>
            </li>
          </ul>
        </nav>

        <div className="mt-10 space-y-10">
          <section id="how-it-works" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight">
              How does the free image compressor work?
            </h2>
            <ol className="mt-4 list-inside list-decimal space-y-2 leading-relaxed text-muted-foreground">
              {compressImageSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section id="formats" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight">
              Which image formats can you compress?
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Compress JPG, PNG, and WebP images. The tool accepts most common
              image formats, though the output depends on the source format and
              browser support. Check the downloaded image to confirm it looks
              right and uses the format you expect.
            </p>
          </section>

          <section id="privacy" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight">
              Are images processed privately in your browser?
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Runs locally in browser. The selected image files are not uploaded
              or sent to our server for compression. The browser performs the
              work on your device, so available memory and processing speed can
              affect how quickly large images finish.
            </p>
          </section>

          <section id="comparison" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight">
              How does this compare with online compressors?
            </h2>
            <div className="mt-4 overflow-x-auto rounded-lg border border-border/70">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Approach
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Where processing happens
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Consideration
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium">
                      Convaudit Compress Image
                    </th>
                    <td className="px-4 py-3">Locally in your browser</td>
                    <td className="px-4 py-3">
                      Uses your device&apos;s memory and processing capacity
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium">
                      Upload-based compressor
                    </th>
                    <td className="px-4 py-3">
                      On the provider&apos;s service after upload
                    </td>
                    <td className="px-4 py-3">
                      Requires sending image files to that provider
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="faq" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight">
              What are common questions about image compression?
            </h2>
            <dl className="mt-4 space-y-6">
              {compressImageFaqs.map(({ q, a }) => (
                <div key={q}>
                  <dt className="font-semibold">{q}</dt>
                  <dd className="mt-2 leading-relaxed text-muted-foreground">
                    {a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <footer className="mt-10 border-t border-border/70 pt-5 text-sm text-muted-foreground">
          <p>
            <time dateTime={date}>Last updated: {formattedDate}</time>
          </p>
          <address className="mt-2 not-italic">
            Written by{" "}
            <Link className="text-primary underline-offset-4 hover:underline" href="/about">
              Convaudit Team
            </Link>
          </address>
        </footer>
      </article>

      <section
        aria-label="Interactive image compression tool"
        className="mx-auto max-w-4xl px-5 pb-10 sm:px-6 lg:px-8"
      >
        <ToolRenderer slug={tool.slug} />
      </section>
    </>
  );
}

/**
 * Pre-render every tool page at build time (SSG).
 * This makes each tool page fast and SEO-friendly.
 */
export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

/**
 * Generate unique SEO metadata for each tool page.
 * Uses the centralized buildToolMetadata helper which produces:
 *  - unique title and concise description
 *  - canonical: https://convaudit.com/tools/{slug}
 *  - openGraph: title, description, url, type, siteName
 *  - twitter: summary_large_image card
 *  - alternates: canonical + languages (en, ar) for hreflang
 *  - robots: index, follow
 *
 * OG image is auto-generated by app/tools/[slug]/opengraph-image.tsx.
 */
export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return (async () => {
    const { slug } = await params;
    const tool = getToolBySlug(slug);
    if (!tool) {
      return { title: "Tool not found" };
    }
    return buildToolMetadata(tool);
  })();
}

/**
 * Tool page — renders the ToolLayout with the matching tool component.
 */
export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  if (slug === "compress-image") {
    return <CompressImageCitationPage tool={tool} />;
  }

  return (
    <ToolLayout tool={tool}>
      <ToolRenderer slug={slug} />
    </ToolLayout>
  );
}
