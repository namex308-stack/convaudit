import type { MetadataRoute } from "next";
import { TOOLS, SITE_CONFIG } from "@/lib/tools";
import { getAllPosts } from "@/lib/blog";
import {
  ENGAGEMENT_RATE_CALCULATOR,
  FOLLOWER_GROWTH_CALCULATOR,
  INFLUENCER_RATE_CALCULATOR,
  ROAS_CALCULATOR,
  TIKTOK_MONEY_CALCULATOR,
} from "@/lib/calculators";

const CURRENT_CONTENT_DATE = new Date("2026-11-08T00:00:00.000Z");
const STATIC_PAGE_DATES = {
  about: new Date("2026-11-06T00:00:00.000Z"),
  privacy: new Date("2026-11-06T00:00:00.000Z"),
  terms: new Date("2026-11-06T00:00:00.000Z"),
};

/**
 * Generate the sitemap from the tools and calculators, blog posts, and static pages.
 * Available at /sitemap.xml.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const toolSlugs = new Set([
    ...TOOLS.map((tool) => tool.slug),
    ENGAGEMENT_RATE_CALCULATOR.slug,
    FOLLOWER_GROWTH_CALCULATOR.slug,
    INFLUENCER_RATE_CALCULATOR.slug,
    ROAS_CALCULATOR.slug,
    TIKTOK_MONEY_CALCULATOR.slug,
  ]);
  const toolBySlug = new Map(TOOLS.map((tool) => [tool.slug, tool]));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_CONFIG.url}/`,
      lastModified: CURRENT_CONTENT_DATE,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_CONFIG.url}/blog`,
      lastModified: CURRENT_CONTENT_DATE,
      changeFrequency: "weekly",
      priority: 0.3,
    },
    {
      url: `${SITE_CONFIG.url}/blog/archive`,
      lastModified: CURRENT_CONTENT_DATE,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_CONFIG.url}/about`,
      lastModified: STATIC_PAGE_DATES.about,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_CONFIG.url}/privacy`,
      lastModified: STATIC_PAGE_DATES.privacy,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_CONFIG.url}/terms`,
      lastModified: STATIC_PAGE_DATES.terms,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const toolPages: MetadataRoute.Sitemap = Array.from(toolSlugs, (slug) => {
    const tool = toolBySlug.get(slug);

    return {
      url: `${SITE_CONFIG.url}/tools/${slug}`,
      lastModified: CURRENT_CONTENT_DATE,
      changeFrequency: "monthly",
      priority: tool?.category === "Image" || tool?.category === "PDF" ? 0.9 : 0.8,
    };
  });

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
    lastModified: new Date(`${post.modifiedDate ?? post.date}T00:00:00.000Z`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const uniquePages = new Map(
    [...staticPages, ...toolPages, ...blogPages].map((page) => [page.url, page]),
  );
  return [...uniquePages.values()];
}
