import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronRight, ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/JsonLd";
import { ContentAttribution } from "@/components/seo/ContentAttribution";
import { RelatedGuide } from "@/components/seo/RelatedGuide";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";
import { SITE_CONFIG, getToolBySlug } from "@/lib/tools";
import { buildBlogPostMetadata } from "@/lib/seo";
import { AdSlot } from "@/components/ads/AdSlot";

/**
 * Pre-render every blog post at build time (SSG).
 */
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

/**
 * Generate SEO metadata for each blog post.
 * Uses the centralized buildBlogPostMetadata helper for consistency.
 */
export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return (async () => {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return { title: "Post not found" };
    return buildBlogPostMetadata(post);
  })();
}

/**
 * Blog post detail page.
 *
 * Renders the markdown body with react-markdown + remark-gfm (for tables,
 * strikethrough, etc.). Includes breadcrumbs, post metadata, an ad slot
 * above and below the body, JSON-LD Article structured data, and a
 * "Back to blog" link at the bottom.
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const primaryTool = post.toolSlug ? getToolBySlug(post.toolSlug) : undefined;
  if (!primaryTool) {
    throw new Error(`Missing primary tool for blog post: ${post.slug}`);
  }
  const [intro, ...bodySections] = post.content.trim().split(/\r?\n\s*\r?\n/);
  const articleBody = bodySections.join("\n\n");

  // JSON-LD Article structured data for rich results.
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.modifiedDate ?? post.date,
    author: {
      "@type": "Organization",
      name: post.author,
      url: `${SITE_CONFIG.url}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
  };

  // BreadcrumbList JSON-LD — Home > Blog > Post
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_CONFIG.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_CONFIG.url}/blog/${post.slug}` },
    ],
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:px-6 lg:px-8">
      <JsonLd data={articleLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />

      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/blog">Blog</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>
            Published{" "}
            <time dateTime={post.date} className="font-medium">
              {formatDate(post.date)}
            </time>
          </span>
          {post.modifiedDate && post.modifiedDate !== post.date && (
            <>
              <span aria-hidden>·</span>
              <span>
                Updated{" "}
                <time dateTime={post.modifiedDate} className="font-medium">
                  {formatDate(post.modifiedDate)}
                </time>
              </span>
            </>
          )}
          <span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
          <span aria-hidden>·</span>
          <Link href="/about" className="underline underline-offset-4">
            {post.author}
          </Link>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {post.description}
        </p>
        {post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {/* Ad above the body */}
      <AdSlot slot="7777777777" label="Advertisement" />

      {/* Markdown body */}
      <div className="prose mt-10">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {intro}
        </ReactMarkdown>
        <p>
          Use the{" "}
          <Link href={`/tools/${primaryTool.slug}`}>{primaryTool.name}</Link>{" "}
          to follow the steps in this guide.
        </p>
      </div>

      <div className="prose mt-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{articleBody}</ReactMarkdown>
      </div>

      {/* Ad below the body */}
      <AdSlot slot="8888888888" label="Advertisement" />

      <section className="mt-10 rounded-xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <h2 className="text-xl font-semibold tracking-tight">
          Ready to use {primaryTool.name}?
        </h2>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          <Link
            href={`/tools/${primaryTool.slug}`}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Open the {primaryTool.name}
          </Link>{" "}
          to apply the steps in this guide.
        </p>
      </section>

      <RelatedGuide toolSlug={primaryTool.slug} toolName={primaryTool.name} />
      <ContentAttribution
        author={post.author}
        lastUpdated={post.modifiedDate ?? post.date}
      />

      <div className="mt-12 border-t border-border/60 pt-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/blog">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to blog
          </Link>
        </Button>
      </div>
    </article>
  );
}
