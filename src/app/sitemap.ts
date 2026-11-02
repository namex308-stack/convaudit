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
  const postUpdateBySlug = new Map(
    posts.map((post) => [
      post.slug,
      new Date(`${post.modifiedDate ?? post.date}T00:00:00.000Z`),
    ]),
  );
  const latestPostUpdateByTool = new Map<string, Date>();
  for (const post of posts) {
    if (!post.toolSlug) continue;
    const postUpdate = postUpdateBySlug.get(post.slug);
    if (!postUpdate) continue;
    const latestUpdate = latestPostUpdateByTool.get(post.toolSlug);
    if (!latestUpdate || postUpdate > latestUpdate) {
      latestPostUpdateByTool.set(post.toolSlug, postUpdate);
    }
  }
  const latestPostUpdate = posts.reduce<Date | undefined>((latest, post) => {
    const postUpdate = new Date(`${post.modifiedDate ?? post.date}T00:00:00.000Z`);
    return !latest || postUpdate > latest ? postUpdate : latest;
  }, undefined);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_CONFIG.url}/`, changeFrequency: "weekly", priority: 1.0 },
    {
      url: `${SITE_CONFIG.url}/blog`,
      ...(latestPostUpdate ? { lastModified: latestPostUpdate } : {}),
      changeFrequency: "weekly",
      priority: 0.3,
    },
    {
      url: `${SITE_CONFIG.url}/blog/archive`,
      ...(latestPostUpdate ? { lastModified: latestPostUpdate } : {}),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    { url: `${SITE_CONFIG.url}/about`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_CONFIG.url}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_CONFIG.url}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const toolPages: MetadataRoute.Sitemap = Array.from(toolSlugs, (slug) => {
    const tool = toolBySlug.get(slug);
    const blogUpdate = tool?.blogSlug
      ? postUpdateBySlug.get(tool.blogSlug)
      : undefined;
    const lastModified = blogUpdate ?? latestPostUpdateByTool.get(slug);

    return {
      url: `${SITE_CONFIG.url}/tools/${slug}`,
      ...(lastModified ? { lastModified } : {}),
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

  return [...staticPages, ...toolPages, ...blogPages];
}
