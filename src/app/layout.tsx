import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AdPreferencesProvider } from "@/components/ads/AdPreferences";
import { AdBlockDetector } from "@/components/ads/AdBlockDetector";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import {
  ConsentManagedScripts,
  PrivacyConsentProvider,
} from "@/components/ads/PrivacyConsent";
import { SITE_CONFIG } from "@/lib/tools";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const googleSearchConsoleToken = (process.env.NEXT_PUBLIC_GSC_TOKEN || "").trim();

/**
 * Global metadata — applies to every page unless overridden.
 *
 * - title.template: "%s | Convaudit" — per-page titles get the brand appended
 * - title.default: shown on the home page and when no title is set
 * - metadataBase: resolves all relative metadata URLs against convaudit.com
 * - verification: optional Google Search Console + AdSense env configuration
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: "%s | Convaudit",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
  },
  description: SITE_CONFIG.description,
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${SITE_CONFIG.url}/rss.xml`,
      "text/plain": `${SITE_CONFIG.url}/llms.txt`,
    },
    languages: {
      en: SITE_CONFIG.url,
      ar: SITE_CONFIG.url,
    },
  },
  other: {
    "llms.txt": `${SITE_CONFIG.url}/llms.txt`,
  },
  openGraph: {
    title: `${SITE_CONFIG.title} | ${SITE_CONFIG.name}`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_AR"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.title} | ${SITE_CONFIG.name}`,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(googleSearchConsoleToken || SITE_CONFIG.adsenseClient
    ? {
        verification: {
          ...(googleSearchConsoleToken
            ? { google: googleSearchConsoleToken }
            : {}),
          ...(SITE_CONFIG.adsenseClient
            ? {
                other: {
                  "google-adsense-account": SITE_CONFIG.adsenseClient,
                },
              }
            : {}),
        },
      }
    : {}),
  category: "utilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Script id="google-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = function(){window.dataLayer.push(arguments);};
            window.gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'denied',
              personalization_storage: 'denied',
              security_storage: 'denied'
            });
          `}
        </Script>
        <ThemeProvider>
          <AdPreferencesProvider>
            <PrivacyConsentProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
              <AdBlockDetector />
              <AdSenseScript />
              <ConsentManagedScripts />
            </PrivacyConsentProvider>
          </AdPreferencesProvider>

          {/* Sitewide JSON-LD: Organization + WebSite with SearchAction.
              These appear in the root layout so they're present on every page. */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: SITE_CONFIG.name,
                url: SITE_CONFIG.url,
                logo: `${SITE_CONFIG.url}/logo.svg`,
                description: SITE_CONFIG.description,
                // Replace with your real social profiles when available.
                sameAs: [
                  "https://twitter.com/convaudit",
                  "https://github.com/convaudit",
                  "https://www.youtube.com/@convaudit",
                ],
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: SITE_CONFIG.name,
                url: SITE_CONFIG.url,
                description: SITE_CONFIG.description,
                publisher: {
                  "@type": "Organization",
                  name: SITE_CONFIG.name,
                  url: SITE_CONFIG.url,
                },
                // Sitelinks search box for the on-site search route.
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
                  },
                  "query-input": "required name=search_term_string",
                },
              }),
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
