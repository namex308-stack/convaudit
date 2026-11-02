import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { TOOLS, type Tool } from "@/lib/tools";
import { getRecentPosts, formatDate, type BlogPostMeta } from "@/lib/blog";

type RelatedToolsProps = {
  /** Slug of the current tool — excluded from related list */
  currentSlug: string;
  /** Category to prioritize when picking related tools */
  category: Tool["category"];
  /** Render the compact format used in tool-page sidebars. */
  compact?: boolean;
};

/**
 * Related tools + blog post section shown at the bottom of every tool page.
 *
 * - Picks 3 tools from the same category (falls back to other categories
 *   if there aren't 3 in the same one).
 * - Picks the most recent blog post (or first one if no recent posts).
 *
 * Implements internal linking best practice: every page links to other
 * relevant pages, which helps search engines crawl the site and understand
 * topical relationships.
 */
export function RelatedTools({
  currentSlug,
  category,
  compact = false,
}: RelatedToolsProps) {
  // Get 3 related tools: prefer same category, fall back to others
  const sameCategory = TOOLS.filter(
    (t) => t.slug !== currentSlug && t.category === category
  );
  const otherCategory = TOOLS.filter(
    (t) => t.slug !== currentSlug && t.category !== category
  );
  const related = [...sameCategory, ...otherCategory].slice(0, 3);

  // Pick a blog post (first one — could be made smarter with tag matching)
  const blogPost = getRecentPosts(1)[0];

  if (related.length === 0 && !blogPost) return null;

  if (compact) {
    return (
      <section
        className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs"
        aria-labelledby="related-heading"
      >
        <h2 id="related-heading" className="text-sm font-semibold">
          Related tools &amp; guides
        </h2>
        <ul className="mt-3 space-y-2">
          {related.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}`}
                className="group flex items-start justify-between gap-2 rounded-lg p-2 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="min-w-0">
                  <span className="block font-medium">{tool.name}</span>
                  <span className="mt-0.5 block line-clamp-2 text-xs text-muted-foreground">
                    {tool.description}
                  </span>
                </span>
                <ArrowRight
                  className="mt-0.5 size-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
        {blogPost && (
          <Link
            href={`/blog/${blogPost.slug}`}
            className="mt-3 flex items-start gap-2 border-t border-border/70 pt-3 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FileText className="mt-0.5 size-3.5 flex-none" aria-hidden />
            <span>
              <span className="block font-medium text-foreground">
                {blogPost.title}
              </span>
              <span className="mt-1 block">
                {formatDate(blogPost.date)} · {blogPost.readingTime} min read
              </span>
            </span>
          </Link>
        )}
      </section>
    );
  }

  return (
    <section className="mt-16" aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className="text-xl font-semibold tracking-tight sm:text-2xl"
      >
        Related tools &amp; guides
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Keep exploring Convaudit with these related resources.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group flex flex-col gap-2 rounded-xl border border-border/70 bg-card p-4 transition-all hover:border-border hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: tool.accent }}
                    aria-hidden
                  />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {tool.category}
                  </span>
                </div>
                <h3 className="mt-1.5 text-sm font-semibold tracking-tight">
                  {tool.name}
                </h3>
              </div>
              <ArrowRight
                className="h-3.5 w-3.5 flex-none text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden
              />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {tool.description}
            </p>
          </Link>
        ))}

        {blogPost && <BlogCard post={blogPost} />}
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-2 rounded-xl border border-dashed border-border/70 bg-muted/20 p-4 transition-all hover:border-border hover:bg-muted/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <FileText className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Blog
            </span>
          </div>
          <h3 className="mt-1.5 text-sm font-semibold tracking-tight line-clamp-2">
            {post.title}
          </h3>
        </div>
        <ArrowRight
          className="h-3.5 w-3.5 flex-none text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-foreground"
          aria-hidden
        />
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
        {post.description}
      </p>
      <p className="mt-auto text-[10px] text-muted-foreground/70">
        {formatDate(post.date)} · {post.readingTime} min read
      </p>
    </Link>
  );
}
