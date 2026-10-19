import type { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatDate, getAllPosts } from "@/lib/blog";
import { buildStaticPageMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/tools";

const archivePath = "/blog/archive";
const archiveDescription =
  "Browse Convaudit articles by publication year, including practical guides to images, PDFs, photo metadata, and YouTube thumbnails.";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "Blog Archive by Year",
  description: archiveDescription,
  path: archivePath,
});

export default function BlogArchivePage() {
  const posts = getAllPosts();
  const postsByYear = posts.reduce((groups, post) => {
    const year = post.date.slice(0, 4);
    const yearPosts = groups.get(year) ?? [];
    yearPosts.push(post);
    groups.set(year, yearPosts);
    return groups;
  }, new Map<string, typeof posts>());
  const years = Array.from(postsByYear.keys()).sort((a, b) => b.localeCompare(a));
  const archiveUrl = `${SITE_CONFIG.url}${archivePath}`;
  const itemList = posts.map((post, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: post.title,
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
  }));

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.url },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_CONFIG.url}/blog` },
              { "@type": "ListItem", position: 3, name: "Archive", item: archiveUrl },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Convaudit Blog Archive",
            itemListElement: itemList,
          }),
        }}
      />

      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/blog">Blog</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Archive</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Blog archive
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Browse all articles by their original publication year.
        </p>
      </header>

      {years.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          No articles published yet.
        </p>
      ) : (
        <div className="space-y-10">
          {years.map((year) => (
            <section key={year} aria-labelledby={`archive-${year}`}>
              <h2
                id={`archive-${year}`}
                className="mb-4 border-b border-border/70 pb-2 text-2xl font-semibold tracking-tight"
              >
                {year}
              </h2>
              <ul className="space-y-4">
                {postsByYear.get(year)?.map((post) => (
                  <li
                    key={post.slug}
                    className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4"
                  >
                    <time
                      dateTime={post.date}
                      className="shrink-0 text-sm text-muted-foreground sm:w-36"
                    >
                      {formatDate(post.date)}
                    </time>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
