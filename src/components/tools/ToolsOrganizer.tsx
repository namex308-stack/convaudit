"use client";

import { useMemo, useState } from "react";
import {
  FileCheck2,
  Search,
  SearchX,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocalStoragePanel } from "@/components/PrivacyPanel";
import { getToolDisplayCategory, ToolCard } from "./ToolCategorySection";
import { TOOLS } from "@/lib/tools";

const categories = ["All", "Image", "PDF", "YouTube"] as const;
type CategoryFilter = (typeof categories)[number];

const trustPoints = [
  {
    title: "No file uploads",
    description: "Image and PDF files stay on your device.",
    icon: FileCheck2,
  },
  {
    title: "No sign-up",
    description: "Open a tool and get straight to work.",
    icon: UserRound,
  },
  {
    title: "Transparent data use",
    description: "Every tool explains what it shares.",
    icon: ShieldCheck,
  },
];

export function ToolsOrganizer() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const query = searchQuery.trim().toLowerCase();

  const filteredTools = useMemo(
    () =>
      TOOLS.filter((tool) => {
        const matchesCategory =
          activeCategory === "All" ||
          getToolDisplayCategory(tool) === activeCategory;
        const matchesSearch =
          !query ||
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.keywords.some((keyword) => keyword.toLowerCase().includes(query));

        return matchesCategory && matchesSearch;
      }),
    [activeCategory, query],
  );

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
  };

  return (
    <div className="space-y-12">
      <section
        aria-labelledby="home-heading"
        className="mx-auto max-w-4xl pt-8 text-center sm:pt-14"
      >
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Free tools. Privacy by design.
        </p>
        <h1
          id="home-heading"
          className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-display"
        >
          22 free tools that work in your browser. No uploads, no sign-up.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Compress, convert, and create in one place. Image and PDF files are
          processed on your device. Some YouTube tools send video URLs to
          external services—each tool clearly explains what it shares.
        </p>
        <div
          role="search"
          aria-label="Search tools"
          className="relative mx-auto mt-8 max-w-2xl text-left"
        >
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <label className="sr-only" htmlFor="tool-search">
            Search all tools
          </label>
          <Input
            id="tool-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="What do you want to do?"
            autoComplete="off"
            className="h-14 rounded-xl border-border bg-card pl-12 pr-12 text-base shadow-card placeholder:text-muted-foreground/80 focus-visible:ring-2"
            aria-controls="tool-results"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 size-10 -translate-y-1/2"
              onClick={() => setSearchQuery("")}
              aria-label="Clear tool search"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </section>

      <section
        aria-label="Convaudit benefits"
        className="grid gap-4 rounded-2xl border border-border bg-muted/40 p-5 sm:grid-cols-3 sm:p-6"
      >
        {trustPoints.map(({ title, description, icon: Icon }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section id="tools" aria-labelledby="tools-heading" className="scroll-mt-24">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="tools-heading"
              className="text-2xl font-semibold tracking-tight sm:text-h2"
            >
              Find your tool
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Simple, focused tools for the work you do every day.
            </p>
          </div>
          <div
            role="group"
            aria-label="Filter tools by category"
            className="flex flex-wrap gap-2"
          >
            {categories.map((category) => {
              const count =
                category === "All"
                  ? TOOLS.length
                  : TOOLS.filter(
                      (tool) => getToolDisplayCategory(tool) === category,
                    ).length;

              return (
                <Button
                  key={category}
                  type="button"
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                  <span className="text-xs opacity-75">{count}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground" role="status">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filteredTools.length}
          </span>{" "}
          of {TOOLS.length} tools
        </p>

        {filteredTools.length > 0 ? (
          <div
            id="tool-results"
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div
            id="tool-results"
            className="mt-4 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-12 text-center"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchX className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-semibold">No tools found</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Try a different search, or clear your filters to browse all tools.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-5"
              onClick={clearFilters}
            >
              Clear search and filters
            </Button>
          </div>
        )}
      </section>

      <div className="fixed bottom-6 right-6 z-50">
        <LocalStoragePanel />
      </div>
    </div>
  );
}
