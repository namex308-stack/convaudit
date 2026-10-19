import type { MetadataRoute } from "next";
import { TOOLS, SITE_CONFIG } from "@/lib/tools";
import { getAllPosts } from "@/lib/blog";

/**
 * Generate the sitemap from the TOOLS array, blog posts, plus static pages.
 * Available at /sitemap.xml.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latestPostUpdate = posts.reduce<Date | undefined>((latest, post) => {
    const postUpdate = new Date(`${post.modifiedDate ?? post.date}T00:00:00.000Z`);
    return !latest || postUpdate > latest ? postUpdate : latest;
  }, undefined);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_CONFIG.url}/`, changeFrequency: "weekly" },
    {
      url: `${SITE_CONFIG.url}/blog`,
      ...(latestPostUpdate ? { lastModified: latestPostUpdate } : {}),
      changeFrequency: "weekly",
    },
    {
      url: `${SITE_CONFIG.url}/blog/archive`,
      ...(latestPostUpdate ? { lastModified: latestPostUpdate } : {}),
      changeFrequency: "monthly",
    },
    { url: `${SITE_CONFIG.url}/about`, changeFrequency: "monthly" },
    { url: `${SITE_CONFIG.url}/privacy`, changeFrequency: "yearly" },
    { url: `${SITE_CONFIG.url}/terms`, changeFrequency: "yearly" },
  ];

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: `${SITE_CONFIG.url}/tools/${t.slug}`,
    changeFrequency: "monthly",
  }));

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
    lastModified: new Date(`${post.modifiedDate ?? post.date}T00:00:00.000Z`),
    changeFrequency: "monthly",
  }));

  return [...staticPages, ...toolPages, ...blogPages];
}
