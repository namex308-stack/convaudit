import type { Metadata } from "next";
import { buildStaticPageMetadata } from "@/lib/seo";
import { TOOLS, SITE_CONFIG, type ToolPrivacyMode } from "@/lib/tools";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "About",
  description:
    "Meet Ali Hashim Ali, founder and lead developer of Convaudit, and learn how its free image, PDF and creator tools handle your data.",
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
        {SITE_CONFIG.name} offers free online tools for processing images and
        PDF files, along with utilities for YouTube and social media content
        creators. Our goal is to make everyday digital tasks simpler and
        faster with clear, easy-to-use tools that do not require an account.
      </p>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Our mission</h2>
        <p className="leading-relaxed text-muted-foreground">
          Privacy is central to what we do. Our image and PDF tools are
          designed to work directly in your browser without requiring you to
          upload files to external servers. We aim to explain clearly how data
          is handled, so you know what happens to your files when you use our
          tools. We value simplicity, transparency, and making useful tools
          accessible to everyone.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Why Trust Convaudit?
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Many image and PDF tools process your files in your browser using web
          technologies such as JavaScript and WebAssembly where needed. For
          those tools, the file contents are not uploaded to our servers.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Privacy details vary by tool. Tools that look up public YouTube
          information may send a video or channel URL to YouTube or another
          disclosed endpoint; each tool page explains its data handling before
          you use it.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Our mission is to make useful online tools free to use, without
          watermarks or account requirements. We aim to keep the experience
          straightforward and explain what each tool does with your input.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          About the founder
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          I&apos;m Ali Hashim Ali, founder and lead developer of Convaudit. I
          work in programming and web development, and I care about building
          digital tools that are useful, easy to use, and respectful of the
          privacy of the people who rely on them.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          I launched Convaudit to offer practical tools for images, PDF files,
          and content creators while reducing the need to send personal files
          to external services. I aim to develop the site to meet users&apos;
          needs while remaining clear about how its tools work and what data
          they handle.
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
          <table className="w-full min-w-xl text-left text-sm">
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
          Optional advertising helps us continue to offer our tools for free.
          Advertising and analytics preferences can be changed in Privacy
          settings.
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

    </article>
  );
}
