import type { Metadata } from "next";
import { buildStaticPageMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/tools";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "Privacy Policy",
  description:
    "What data Convaudit's images, PDFs and YouTube creator tools use, where it goes, and how to manage optional analytics and advertising.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: October 19, 2026
      </p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            What the site handles
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Convaudit provides tools for images, PDFs and YouTube creator
            tasks. You do not need an account to use them. The tools do not
            upload image or PDF contents to our server for processing. Most
            YouTube tools also work in your browser; see About for the
            per-tool details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            Tool inputs and server requests
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The YouTube Tags Extractor is the only tool that sends an input
            URL to our server. It sends the video URL to{" "}
            <code>/api/youtube-tags</code>; our server validates it, requests
            the public video page from YouTube, and returns tags found on
            that page. The endpoint does not save the submitted URL or page
            contents in an application database. It uses the request IP
            address for an in-memory rate limit with a one-minute window;
            expired entries are removed on a later API request.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The Thumbnail Downloader and Thumbnail Tester load public
            thumbnails from YouTube directly in your browser. The Channel ID
            Finder sends video lookups to YouTube and channel-handle URLs to
            the AllOrigins proxy. Those providers receive the requests they
            handle under their own privacy practices.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Like any website, our hosting provider receives connection and
            request information needed to serve the site, such as IP address,
            browser details, and requested URL. Hosting and network providers
            may keep logs. We do not have confirmed retention details for
            those logs yet; see the owner checklist below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            Analytics and advertising
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Optional analytics are provided by {SITE_CONFIG.analyticsProvider}.
            These scripts load only after you choose “Allow optional.”
            Google Analytics 4 is configured with IP anonymization. Google
            AdSense loads only if an AdSense publisher ID is configured and
            you allow optional services. When enabled, these providers may
            process usage, device, browser, and network information under
            their own policies.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            You can reject optional services or change your choice with the
            Privacy settings control in the footer. You can also manage
            Google ad personalization in{" "}
            <a
              className="text-foreground underline underline-offset-4"
              href="https://adssettings.google.com/"
              rel="noreferrer"
              target="_blank"
            >
              Google Ads Settings
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            Cookies and browser storage
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The site stores preferences in your browser&apos;s local storage,
            rather than site cookies: your theme, optional-consent choice, ad
            display preference, recently used tools, and some interface
            preferences. A session-storage flag remembers when you dismiss
            the ad-block notice for that browser session. Google Analytics,
            Google AdSense, and other providers may use cookies or similar
            technologies if their optional scripts are enabled. You can
            clear browser storage or manage cookies in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            Retention and your choices
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Selected files and ordinary tool inputs are handled in your
            browser and are not stored by our application. The Tags Extractor
            handles the URL during the request and keeps only an in-memory
            rate-limit entry with a one-minute window, which is purged on a
            later API request after it expires. The hosting provider may
            separately retain request logs. Analytics and advertising
            providers set their own retention periods. Browser preferences
            remain until you clear them or change them.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            You may contact us to ask what personal information we hold,
            request correction or deletion, or raise a privacy concern.
            Rights depend on the law that applies to you. You can withdraw
            optional analytics and advertising consent at any time using
            Privacy settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            Children&apos;s privacy
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The site is not designed for children and does not knowingly
            collect children&apos;s personal information. It does not ask
            for a user&apos;s age. Please do not submit a child&apos;s
            personal information. A parent or guardian who believes a child
            has provided information can contact us to request review or
            removal.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            Changes and contact
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            We will post policy changes here and update the date above. For
            privacy questions or requests, contact{" "}
            <a
              className="text-foreground underline underline-offset-4"
              href="mailto:privacy@convaudit.com"
            >
              privacy@convaudit.com
            </a>
            .
          </p>
        </section>

        <section className="rounded-lg border border-dashed p-4">
          <h2 className="font-semibold">
            TODO_OWNER: confirm before publication
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              TODO_OWNER: Confirm hosting and network providers, their log
              fields, and retention periods.
            </li>
            <li>
              TODO_OWNER: Confirm actual analytics and AdSense deployment,
              consent requirements, and provider retention links.
            </li>
            <li>
              TODO_OWNER: Confirm children&apos;s age scope and handling
              procedure.
            </li>
            <li>
              TODO_OWNER: Confirm privacy@convaudit.com is active and
              monitored.
            </li>
          </ul>
        </section>
      </div>
    </article>
  );
}
