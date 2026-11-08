import Link from "next/link";
import { formatDate } from "@/lib/blog";

export function ContentAttribution({
  author,
  lastUpdated,
}: {
  author: string;
  lastUpdated: string;
}) {
  return (
    <aside className="mt-10 rounded-xl border border-border/70 bg-muted/30 p-5 sm:p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        About the author
      </p>
      <p className="mt-1 font-semibold">{author}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Convaudit is founded by{" "}
        <Link
          href="/about"
          className="text-foreground underline underline-offset-4"
        >
          Ali Hashim Ali
        </Link>
        ,         who leads the development of its tools.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Last updated{" "}
        <time dateTime={lastUpdated} className="font-medium text-foreground">
          {formatDate(lastUpdated)}
        </time>
      </p>
    </aside>
  );
}
