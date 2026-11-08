import Link from "next/link";
import { getRelatedPostForTool } from "@/lib/blog";

export function RelatedGuide({
  toolSlug,
  toolName,
}: {
  toolSlug: string;
  toolName: string;
}) {
  const post = getRelatedPostForTool(toolSlug);
  if (!post) return null;

  return (
    <section className="mt-10 rounded-xl border border-border/70 bg-card p-5 sm:p-6">
      <h2 className="text-xl font-semibold tracking-tight">
        Which guide can help you with {toolName}?
      </h2>
      <p className="mt-2 leading-relaxed text-muted-foreground">
        <Link
          href={`/blog/${post.slug}`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {post.title}
        </Link>
        {" — "}
        {post.description}
      </p>
    </section>
  );
}
