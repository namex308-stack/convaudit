import type { Metadata } from "next";
import { buildStaticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "Terms of Use",
  description:
    "Plain-language terms for using Convaudit's images, PDFs and YouTube creator tools.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Terms of Use
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: October 19, 2026
      </p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-lg font-semibold tracking-tight">What these terms cover</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            These terms apply to your use of the Convaudit website, its images,
            PDFs and YouTube creator tools, and the related information on the
            site. By using the site, you agree to these terms. If you do not
            agree, do not use the tools.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">Acceptable use</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Use the tools lawfully and only with files, URLs, and other
            material you are allowed to use. Do not interfere with the site,
            bypass its usage limits, or use it to violate another person&apos;s
            rights. You are responsible for checking tool results and keeping
            your own copies of important files.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            Files, outputs, and third-party services
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Image and PDF files are processed in your browser. Most YouTube
            tools also run in your browser, but some request public data from
            YouTube or AllOrigins. The Tags Extractor sends a video URL to our
            server, which requests the public YouTube page. See the Privacy
            Policy and About page for the details. Results may be incomplete
            or inaccurate; review them before relying on them.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            YouTube, Google, and other third-party names and marks belong to
            their respective owners. Convaudit is independent and is not
            affiliated with, endorsed by, or sponsored by YouTube or Google.
            Third-party websites and services are governed by their own terms
            and privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            Advertising and availability
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The site is supported by advertising. Ads and links may lead to
            third-party services; we do not control their content. Tools may
            change or become unavailable, and we do not promise uninterrupted
            access.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            Warranty and liability
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The site and tools are provided “as is” and “as available,”
            without promises that they will be error-free, suitable for a
            particular purpose, or produce a specific result. To the extent
            permitted by applicable law, the site operator is not liable for
            indirect or consequential loss arising from use of the site or
            inability to use it. Nothing in these terms excludes liability
            that cannot lawfully be excluded.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            Changes and governing law
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            We may revise these terms by posting an updated version on this
            page and changing the date above. These terms are governed by the
            law of{" "}
            <strong className="text-foreground">
              [TODO_OWNER: jurisdiction]
            </strong>
            , subject to any mandatory rules that apply.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">Contact</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Questions about these terms? Contact{" "}
            <a
              className="text-foreground underline underline-offset-4"
              href="mailto:legal@convaudit.com"
            >
              legal@convaudit.com
            </a>
            .
          </p>
        </section>

        <section className="rounded-lg border border-dashed p-4">
          <h2 className="font-semibold">
            TODO_OWNER: confirm before publication
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>TODO_OWNER: Choose and verify the governing-law jurisdiction.</li>
            <li>
              TODO_OWNER: Confirm legal@convaudit.com is active and monitored.
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
}
