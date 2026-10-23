import Link from "next/link";
import { ChevronRight, ListChecks, ShieldCheck } from "lucide-react";
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
import { getToolPrivacyDetail, ToolPrivacyBadge } from "./ToolPrivacyBadge";
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
 *  - Breadcrumb, title, and data-use disclosure
 *  - Interactive tool with a responsive how-to/privacy/related sidebar
 *  - Search content, consent-gated AdSense slots, and server-rendered FAQs
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
    <article className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
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
          className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm leading-relaxed"
          role="note"
        >
          {tool.notice}
        </aside>
      )}

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10">
        <div className="min-w-0">
          <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-7">
            {children}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24" aria-label="Tool details">
          <section
            className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs"
            aria-labelledby="how-it-works-heading"
          >
            <div className="flex items-center gap-2">
              <ListChecks className="size-4 text-primary" aria-hidden />
              <h2 id="how-it-works-heading" className="text-sm font-semibold">
                How it works
              </h2>
            </div>
            <ol className="mt-4 space-y-3">
              {tool.howToSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed">
                  <span
                    className="flex size-5 flex-none items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section
            className="rounded-2xl border border-teal/20 bg-teal/5 p-5"
            aria-labelledby="privacy-note-heading"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-teal" aria-hidden />
              <h2 id="privacy-note-heading" className="text-sm font-semibold">
                Privacy note
              </h2>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {tool.privacyMode === "browser"
                ? "Your files never leave your device. Processing happens locally in your browser."
                : getToolPrivacyDetail(tool.privacyMode)}
            </p>
          </section>

          <RelatedTools
            currentSlug={tool.slug}
            category={tool.category}
            compact
          />
        </aside>
      </div>

      <AdSlot slot="2222222222" label="Advertisement" />

      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
        {tool.longDescription}
      </p>

      {content && hasContentBody && (
        <section className="prose mt-10 max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </section>
      )}

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
    </article>
  );
}
