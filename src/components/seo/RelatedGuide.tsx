import Link from "next/link";
import { getRelatedPostsForTool } from "@/lib/blog";

export function RelatedGuide({
  toolSlug,
  toolName,
  excludePostSlug,
}: {
  toolSlug: string;
  toolName: string;
  excludePostSlug?: string;
}) {
  const posts = getRelatedPostsForTool(toolSlug, excludePostSlug);
  if (posts.length === 0) return null;

  return (
    <section className="mt-10 rounded-xl border border-border/70 bg-card p-5 sm:p-6">
      <h2 className="text-xl font-semibold tracking-tight">Related Guides</h2>
      <p className="mt-2 leading-relaxed text-muted-foreground">
        Helpful reading for {toolName}.
      </p>
      <ul className="mt-4 space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {post.title}
            </Link>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {post.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
