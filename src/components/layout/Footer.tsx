import Link from "next/link";
import { TOOLS, SITE_CONFIG } from "@/lib/tools";
import { PrivacySettingsButton } from "@/components/ads/PrivacyConsent";
import { BrandMark } from "./BrandMark";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Convaudit home">
              <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-primary">
                <BrandMark className="size-6" />
              </span>
              <span className="text-base font-semibold tracking-tight">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Free tools for everyday work. Image and PDF files stay on your
              device; YouTube tools clearly explain when a video URL is shared.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {["Image", "PDF", "YouTube"].map((category) => (
                <li key={category}>
                  <Link
                    href={`/search?q=${category}`}
                    className="text-muted-foreground transition-colors duration-fast hover:text-foreground"
                  >
                    {category} tools
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Information
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground transition-colors duration-fast hover:text-foreground"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors duration-fast hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground transition-colors duration-fast hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <PrivacySettingsButton />
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Popular tools
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {TOOLS.filter((tool) =>
                ["compress-pdf", "heic-to-jpg", "compress-image"].includes(tool.slug),
              ).map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-muted-foreground transition-colors duration-fast hover:text-foreground"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Processing
            and data sharing vary by tool.
          </p>
          <span lang="en">English</span>
        </div>
      </div>
    </footer>
  );
}
