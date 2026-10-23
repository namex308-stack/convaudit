import Link from "next/link";
import { ArrowUpRight, FileText, Image, Youtube } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TOOLS, type Tool } from "@/lib/tools";
import { ToolPrivacyBadge } from "./ToolPrivacyBadge";

export type ToolDisplayCategory = "Image" | "PDF" | "YouTube";

export function getToolsByCategory(category: Tool["category"] | "all"): Tool[] {
  if (category === "all") return TOOLS;
  return TOOLS.filter((t) => t.category === category);
}

export function getToolDisplayCategory(tool: Tool): ToolDisplayCategory {
  if (tool.category === "YouTube") return "YouTube";
  if (tool.category === "PDF" || tool.slug.includes("pdf")) return "PDF";
  return "Image";
}

export interface ToolCategorySectionProps {
  category: string;
  title: string;
  icon: React.ReactNode;
  badge?: string;
}

export function ToolCard({ tool }: { tool: Tool }) {
  const category = getToolDisplayCategory(tool);
  const CategoryIcon =
    category === "Image" ? Image : category === "PDF" ? FileText : Youtube;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      aria-labelledby={`tool-name-${tool.slug}`}
      aria-describedby={`tool-privacy-${tool.slug}`}
      className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card className="h-full gap-0 border-border bg-card py-0 transition-[transform,border-color,box-shadow] duration-normal group-hover:-translate-y-0.5 group-hover:border-primary/50 group-hover:shadow-card">
        <CardContent className="flex h-full min-h-52 flex-col p-5">
          <div className="mb-5 flex items-center justify-between">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
              <CategoryIcon className="size-5" aria-hidden="true" />
            </span>
            <Badge variant="secondary" className="text-xs font-normal">
              {category}
            </Badge>
          </div>
          <div className="flex items-start justify-between gap-2">
            <h3
              id={`tool-name-${tool.slug}`}
              className="truncate text-base font-semibold tracking-tight"
            >
              {tool.name}
            </h3>
            <ArrowUpRight
              className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-fast group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden="true"
            />
          </div>
          <p className="mt-2 truncate text-sm text-muted-foreground">
            {tool.description}
          </p>
          <div className="mt-auto pt-5">
            <ToolPrivacyBadge
              mode={tool.privacyMode}
              compact
              descriptionId={`tool-privacy-${tool.slug}`}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Section showing tools in a specific category.
 */
export function ToolCategorySection({ category, title, icon, badge }: ToolCategorySectionProps) {
  const tools = getToolsByCategory(category as Tool["category"] | "all");

  return (
    <section id={category} className="scroll-mt-24">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">{icon}</div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {tools.length} tool{tools.length === 1 ? "" : "s"} available
            </p>
          </div>
        </div>
        {badge ? (
          <Badge variant="secondary" className="text-xs">
            {badge}
          </Badge>
        ) : null}
      </div>

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/50 p-12 text-center">
          <p className="text-sm text-muted-foreground">No tools in this category yet.</p>
        </div>
      )}
    </section>
  );
}
