import type { ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { ContentAttribution } from "@/components/seo/ContentAttribution";
import { RelatedGuide } from "@/components/seo/RelatedGuide";
import { SITE_CONFIG } from "@/lib/tools";
import type { CalculatorContent } from "@/lib/calculators";
import { SEO_CONTENT_UPDATED_DATE } from "@/lib/seo";

export function CalculatorPageContent({
  calculator,
  children,
}: {
  calculator: CalculatorContent;
  children: ReactNode;
}) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: calculator.faqs.map(({ q, a }) => ({
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
    name: calculator.name,
    description: calculator.description,
    url: `${SITE_CONFIG.url}/tools/${calculator.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: ["Runs locally in browser"],
  };

  return (
    <article className="mx-auto max-w-4xl px-5 py-10 sm:px-6 lg:px-8">
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />

      <header>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {calculator.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {calculator.directAnswer}
        </p>
      </header>

      <section aria-label={`${calculator.name} inputs`} className="mt-8">
        {children}
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          {calculator.definitionTitle}
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          {calculator.definition}
        </p>
        <div className="rounded-xl border bg-card p-5">
          <p className="font-mono text-sm leading-relaxed sm:text-base">
            {calculator.formula}
          </p>
        </div>
      </section>

      <section aria-labelledby={`${calculator.slug}-faq`} className="mt-10 space-y-5">
        <h2
          id={`${calculator.slug}-faq`}
          className="text-2xl font-semibold tracking-tight"
        >
          What do people ask about {calculator.name}?
        </h2>
        {calculator.faqs.map(({ q, a }) => (
          <div key={q} className="space-y-2">
            <h3 className="text-lg font-semibold">{q}</h3>
            <p className="leading-relaxed text-muted-foreground">{a}</p>
          </div>
        ))}
      </section>
      <RelatedGuide toolSlug={calculator.slug} toolName={calculator.name} />
      <ContentAttribution
        author="Convaudit Team"
        lastUpdated={SEO_CONTENT_UPDATED_DATE}
      />
    </article>
  );
}
