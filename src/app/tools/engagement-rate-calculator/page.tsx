import { CalculatorRenderer } from "@/components/tools/calculators/CalculatorRenderer";
import { JsonLd } from "@/components/JsonLd";
import { ContentAttribution } from "@/components/seo/ContentAttribution";
import { RelatedGuide } from "@/components/seo/RelatedGuide";
import {
  ENGAGEMENT_RATE_CALCULATOR,
  ENGAGEMENT_RATE_FAQS,
} from "@/lib/calculators";
import {
  buildCalculatorMetadata,
  SEO_CONTENT_UPDATED_DATE,
} from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/tools";

export const metadata = buildCalculatorMetadata(
  ENGAGEMENT_RATE_CALCULATOR,
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ENGAGEMENT_RATE_FAQS.map(({ q, a }) => ({
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
  name: ENGAGEMENT_RATE_CALCULATOR.name,
  description: ENGAGEMENT_RATE_CALCULATOR.description,
  url: `${SITE_CONFIG.url}/tools/${ENGAGEMENT_RATE_CALCULATOR.slug}`,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: ["Runs locally in browser"],
};

export default function EngagementRateCalculatorPage() {
  return (
    <article className="mx-auto max-w-4xl px-5 py-10 sm:px-6 lg:px-8">
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />

      <header>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Engagement Rate Calculator
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Engagement rate is the percentage of your followers who interacted
          with a post. Add likes, comments, and shares, divide that total by
          your follower count, then multiply by 100. Use the calculator below
          to get an instant result and compare it with broad Instagram, TikTok,
          and YouTube reference ranges.
        </p>
      </header>

      <section aria-label="Calculator" className="mt-8">
        <CalculatorRenderer slug={ENGAGEMENT_RATE_CALCULATOR.slug} />
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          How do you calculate engagement rate?
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          This calculator uses a follower-based formula. It combines the three
          interaction counts you enter, divides by followers, and converts the
          result to a percentage.
        </p>
        <div className="rounded-xl border bg-card p-5">
          <p className="font-mono text-sm leading-relaxed sm:text-base">
            Engagement rate (%) = ((Likes + Comments + Shares) ÷ Followers) ×
            100
          </p>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          For example, 50 likes, 5 comments, and 2 shares from an account with
          1,000 followers produce an engagement rate of 5.7%. Benchmark
          definitions can vary, so use the platform ranges as general context
          rather than a guarantee of performance.
        </p>
      </section>

      <section aria-labelledby="faq-title" className="mt-10 space-y-5">
        <h2 id="faq-title" className="text-2xl font-semibold tracking-tight">
          What questions do people ask about engagement rate?
        </h2>
        {ENGAGEMENT_RATE_FAQS.map(({ q, a }) => (
          <div key={q} className="space-y-2">
            <h3 className="text-lg font-semibold">{q}</h3>
            <p className="leading-relaxed text-muted-foreground">{a}</p>
          </div>
        ))}
      </section>
      <RelatedGuide
        toolSlug={ENGAGEMENT_RATE_CALCULATOR.slug}
        toolName={ENGAGEMENT_RATE_CALCULATOR.name}
      />
      <ContentAttribution
        author="Convaudit Team"
        lastUpdated={SEO_CONTENT_UPDATED_DATE}
      />
    </article>
  );
}
