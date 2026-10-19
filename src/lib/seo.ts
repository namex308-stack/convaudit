import type { Metadata } from "next";
import { SITE_CONFIG, type Tool } from "./tools";

/**
 * SEO helpers shared across all pages.
 *
 * Centralizes the title pattern and common metadata
 * fields (robots, alternates.languages, OpenGraph defaults) so every page
 * stays consistent.
 */

/** The tool name is unique and the root title template adds the site name. */
export function buildToolTitle(tool: Tool): string {
  return tool.name;
}

function assertMetaDescription(description: string, page: string): void {
  if (!description.trim() || description.length > 160) {
    throw new Error(
      `Meta description for "${page}" must contain 1-160 characters (got ${description.length}).`,
    );
  }
}

/**
 * Build a full Metadata object for a tool page.
 * Includes title, description, canonical, OG, Twitter,
 * alternates.languages (en + ar), and robots.
 */
export function buildToolMetadata(tool: Tool): Metadata {
  const canonical = `${SITE_CONFIG.url}/tools/${tool.slug}`;
  const title = buildToolTitle(tool);
  assertMetaDescription(tool.description, tool.slug);

  return {
    title,
    description: tool.description,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        ar: canonical,
      },
    },
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description: tool.description,
      url: canonical,
      type: "website",
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_CONFIG.name}`,
      description: tool.description,
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
  };
}

/**
 * Build metadata for a blog post.
 */
export function buildBlogPostMetadata(post: {
  slug: string;
  title: string;
  description: string;
  date: string;
  modifiedDate?: string;
  author: string;
  tags: string[];
}): Metadata {
  const canonical = `${SITE_CONFIG.url}/blog/${post.slug}`;
  assertMetaDescription(post.description, post.slug);

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        ar: canonical,
      },
    },
    openGraph: {
      title: `${post.title} | ${SITE_CONFIG.name}`,
      description: post.description,
      url: canonical,
      type: "article",
      siteName: SITE_CONFIG.name,
      publishedTime: post.date,
      modifiedTime: post.modifiedDate,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | ${SITE_CONFIG.name}`,
      description: post.description,
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
  };
}

/**
 * Build metadata for a static page (about, privacy, terms, etc.).
 */
export function buildStaticPageMetadata(options: {
  title: string;
  description: string;
  path: string;
  robots?: Metadata["robots"];
}): Metadata {
  const canonical = `${SITE_CONFIG.url}${options.path}`;
  assertMetaDescription(options.description, options.path);

  return {
    title: options.title,
    description: options.description,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        ar: canonical,
      },
    },
    openGraph: {
      title: `${options.title} | ${SITE_CONFIG.name}`,
      description: options.description,
      url: canonical,
      type: "website",
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${options.title} | ${SITE_CONFIG.name}`,
      description: options.description,
    },
    robots: options.robots ?? {
      index: true,
      follow: true,
    },
  };
}
