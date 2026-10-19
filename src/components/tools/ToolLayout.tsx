import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AdSlot } from "@/components/ads/AdSlot";
import { RelatedTools } from "./RelatedTools";
import { ToolPrivacyBadge } from "./ToolPrivacyBadge";
import { SITE_CONFIG, type Tool } from "@/lib/tools";
import { getToolContent } from "@/lib/tool-content";

type ToolLayoutProps = {
  tool: Tool;
  /** The interactive tool component (already wrapped in 'use client') */
  children: React.ReactNode;
};

/**
 * Layout shared by every tool page.
 *
 * Structured data injected:
 *  - SoftwareApplication (name, category, and offers)
 *  - FAQPage (5+ Q&A from the tool's faqs array)
 *  - HowTo (step-by-step from the tool's howToSteps array)
 *  - BreadcrumbList (Home > Category > Tool)
 *
 * UI sections:
 *  - Breadcrumb (visual)
 *  - H1 + description
 *  - Up to 2 consent-gated AdSense slots, both below the tool UI
 *  - Interactive tool component
 *  - How-to section
 *  - Server-rendered FAQ details
 *  - Related tools + blog post (internal linking)
 */
export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const toolUrl = `${SITE_CONFIG.url}/tools/${tool.slug}`;

  // SoftwareApplication — describes the tool to search engines.
  const softwareAppLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (web-based)",
    description: tool.description,
    url: toolUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  // FAQPage — eligible for rich results in Google search.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  // HowTo — step-by-step instructions, eligible for rich results.
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.name}`,
    step: tool.howToSteps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
  };

  // BreadcrumbList — Home > Category > Tool
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${tool.category} Tools`,
        item: `${SITE_CONFIG.url}/#tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: toolUrl,
      },
    ],
  };
  const content = getToolContent(tool.slug);
  const hasContentBody = Boolean(
    content?.replace(/^#{1,6}\s+.*$/gm, "").trim(),
  );

  return (
    <article className="mx-auto max-w-4xl px-5 py-12 sm:px-6 lg:px-8">
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/#tools">{tool.category}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{tool.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: tool.accent }}
            aria-hidden
          />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {tool.category} Tool
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {tool.name}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {tool.description}
        </p>
        <div className="mt-3">
          <ToolPrivacyBadge mode={tool.privacyMode} />
        </div>
      </header>

      {tool.notice && (
        <aside
          className="mb-5 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm leading-relaxed"
          role="note"
        >
          {tool.notice}
        </aside>
      )}

      {/* The interactive tool component */}
      <section className="rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-7">
        {children}
      </section>

      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
        {tool.longDescription}
      </p>

      {/* Tool blog post — unique SEO content per tool */}
      {content && hasContentBody && (
        <section className="prose mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </section>
      )}

      {/* Ad: below the tool UI */}
      <AdSlot slot="2222222222" label="Advertisement" />

      {/* How to use */}
      <section className="mt-12" aria-labelledby="how-to-heading">
        <h2
          id="how-to-heading"
          className="text-xl font-semibold tracking-tight sm:text-2xl"
        >
          How to use {tool.name}
        </h2>
        <ol className="mt-5 space-y-3">
          {tool.howToSteps.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-3.5"
            >
              <span
                className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-foreground text-xs font-semibold text-background"
                aria-hidden
              >
                {i + 1}
              </span>
              <span className="pt-0.5 text-sm leading-relaxed text-foreground/90">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Ad: below the tool UI and before FAQ */}
      <AdSlot slot="3333333333" label="Advertisement" />

      {/* FAQ */}
      <section className="mt-12" aria-labelledby="faq-heading">
        <h2
          id="faq-heading"
          className="text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Frequently Asked Questions
        </h2>
        <div className="mt-5 divide-y divide-border/60 rounded-lg border border-border/60">
          {tool.faqs.map((faq, i) => (
            <details key={i} className="group px-4">
              <summary className="cursor-pointer list-none py-4 pr-8 text-[15px] font-medium marker:hidden [&::-webkit-details-marker]:hidden">
                {faq.q}
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Internal linking: related tools + blog post */}
      <RelatedTools currentSlug={tool.slug} category={tool.category} />
    </article>
  );
}
