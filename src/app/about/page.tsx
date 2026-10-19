import type { Metadata } from "next";
import { buildStaticPageMetadata } from "@/lib/seo";
import { TOOLS, SITE_CONFIG, type ToolPrivacyMode } from "@/lib/tools";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "About the Site",
  description:
    "Learn who runs Convaudit, how its images, PDFs and YouTube creator tools work, and how to contact the site.",
  path: "/about",
});

const DATA_HANDLING: Record<ToolPrivacyMode, string> = {
  browser:
    "Runs in your browser. The tool does not send its input to our server or make content requests to third parties.",
  "youtube-thumbnails":
    "Your browser requests public video metadata and thumbnail images directly from YouTube.",
  "youtube-thumbnail-preview":
    "Image-file previews stay in your browser. If you enter a YouTube URL, your browser loads public thumbnails directly from YouTube.",
  "youtube-and-proxy":
    "Your browser sends video URLs to YouTube and channel-handle URLs to the AllOrigins proxy.",
  "server-video-url":
    "The video URL is sent to our server, which requests the public YouTube video page to read its tags.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        About {SITE_CONFIG.name}
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        {SITE_CONFIG.name} is operated by{" "}
        <strong className="text-foreground">
          [TODO_OWNER: operator&apos;s name or registered brand]
        </strong>
        , based in{" "}
        <strong className="text-foreground">[TODO_OWNER: country]</strong>.
        The site offers practical tools for images, PDFs and YouTube creator
        tasks without requiring an account.
      </p>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Our mission</h2>
        <p className="leading-relaxed text-muted-foreground">
          Make everyday file and creator workflows straightforward, explain
          what each tool does, and be clear about where its inputs are
          processed. Image and PDF files are processed in your browser. Some
          YouTube tools request public data from YouTube or another provider;
          only the Tags Extractor sends a video URL to our server.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          How each tool handles your input
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          This list covers all {TOOLS.length} tools currently offered. Browser
          processing does not mean there are no site or third-party requests;
          the table calls those out where they apply.
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Tool
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Where input is processed / sent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {TOOLS.map((tool) => (
                <tr key={tool.slug}>
                  <th scope="row" className="px-4 py-3 font-medium">
                    {tool.name}
                  </th>
                  <td className="px-4 py-3 leading-relaxed text-muted-foreground">
                    {DATA_HANDLING[tool.privacyMode]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          How the site is supported
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          The site is supported by advertising. Google AdSense is used when an
          advertising account is configured and you allow optional
          advertising. Optional analytics and advertising can be changed in
          Privacy settings.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Contact and bugs</h2>
        <p className="leading-relaxed text-muted-foreground">
          For questions, feature requests, or bug reports, email{" "}
          <a
            className="text-foreground underline underline-offset-4"
            href="mailto:support@convaudit.com"
          >
            support@convaudit.com
          </a>
          . For privacy requests, use{" "}
          <a
            className="text-foreground underline underline-offset-4"
            href="mailto:privacy@convaudit.com"
          >
            privacy@convaudit.com
          </a>
          .
        </p>
      </section>

      <section className="mt-8 rounded-lg border border-dashed p-4">
        <h2 className="font-semibold">TODO_OWNER: before publication</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>
            TODO_OWNER: Replace the operator name/brand and country
            placeholders.
          </li>
          <li>
            TODO_OWNER: Confirm both contact addresses are active and
            monitored.
          </li>
        </ul>
      </section>
    </article>
  );
}
