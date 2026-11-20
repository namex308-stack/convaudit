import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/tools";

/**
 * Public pages are available to search and answer-engine crawlers.
 * General model-training and dataset crawlers are disallowed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
        other: {
          "Content-Signal": "ai-train=no, search=yes, ai-input=yes",
          Host: "https://convaudit.com",
        },
      },
      {
        userAgent: [
          "OAI-SearchBot",
          "ChatGPT-User",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
        ],
        allow: "/",
        disallow: ["/api/", "/admin/"],
        other: {
          "Content-Signal": "ai-train=no, search=yes, ai-input=yes",
          Host: "https://convaudit.com",
        },
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "CCBot"],
        disallow: "/",
        other: {
          "Content-Signal": "ai-train=no, search=yes, ai-input=yes",
          Host: "https://convaudit.com",
        },
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
