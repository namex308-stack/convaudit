"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getToolBySlug,
  SITE_CONFIG,
  TOOLS,
  type Tool,
} from "@/lib/tools";

const TOOL_CATEGORIES = [
  "Image",
  "PDF",
  "Conversion",
  "YouTube",
  "Social Media",
] as const;

type ToolCategory = (typeof TOOL_CATEGORIES)[number];
type JsonSchema = {
  type: "object";
  properties: Record<
    string,
    {
      type: "string";
      description: string;
      enum?: readonly string[];
    }
  >;
  required?: string[];
  additionalProperties: false;
};

type WebMcpTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: JsonSchema;
  execute: (input: unknown) => unknown | Promise<unknown>;
};

type WebMcpContext = {
  registerTool(
    tool: WebMcpTool,
    options: { signal: AbortSignal },
  ): Promise<void>;
};

type AppRouter = ReturnType<typeof useRouter>;

function isToolCategory(value: unknown): value is ToolCategory {
  return (
    typeof value === "string" &&
    TOOL_CATEGORIES.some((category) => category === value)
  );
}

function getInputObject(input: unknown): Record<string, unknown> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new TypeError("Tool input must be an object.");
  }

  return input as Record<string, unknown>;
}

function getSlug(input: unknown): string {
  const slug = getInputObject(input).slug;
  if (typeof slug !== "string" || slug.trim() === "") {
    throw new TypeError("A tool slug is required.");
  }

  return slug.trim();
}

function describeTool(tool: Tool) {
  return {
    slug: tool.slug,
    name: tool.name,
    description: tool.description,
    category: tool.category,
    privacyMode: tool.privacyMode,
    url: `${SITE_CONFIG.url}/tools/${tool.slug}`,
  };
}

function createWebMcpTools(router: AppRouter): WebMcpTool[] {
  return [
    {
      name: "search_site_tools",
      title: "Search site tools",
      description:
        "Find Convaudit tools by name, category, description, or keyword.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search words or phrases. Omit to browse all tools.",
          },
          category: {
            type: "string",
            description: "Optional tool category to filter by.",
            enum: TOOL_CATEGORIES,
          },
        },
        additionalProperties: false,
      },
      execute(input) {
        const values = getInputObject(input);
        const query = values.query;
        const category = values.category;

        if (query !== undefined && typeof query !== "string") {
          throw new TypeError("The search query must be a string.");
        }
        if (
          category !== undefined &&
          !isToolCategory(category)
        ) {
          throw new TypeError("The requested category is not supported.");
        }

        const normalizedQuery = query?.trim().toLowerCase();
        const matches = TOOLS.filter((tool) => {
          const matchesCategory =
            category === undefined || tool.category === category;
          const searchText = [
            tool.name,
            tool.description,
            ...tool.keywords,
          ]
            .join(" ")
            .toLowerCase();

          return (
            matchesCategory &&
            (!normalizedQuery || searchText.includes(normalizedQuery))
          );
        });

        return {
          totalMatches: matches.length,
          results: matches.slice(0, 10).map(describeTool),
          hasMore: matches.length > 10,
        };
      },
    },
    {
      name: "get_tool_details",
      title: "Get tool details",
      description:
        "Retrieve a Convaudit tool's description, privacy mode, usage steps, and FAQs by slug.",
      inputSchema: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description: "The slug from a tool URL, such as compress-image.",
          },
        },
        required: ["slug"],
        additionalProperties: false,
      },
      execute(input) {
        const tool = getToolBySlug(getSlug(input));
        if (!tool) {
          throw new Error("No tool exists with that slug.");
        }

        return {
          ...describeTool(tool),
          longDescription: tool.longDescription,
          howToSteps: tool.howToSteps,
          faqs: tool.faqs,
        };
      },
    },
    {
      name: "open_site_tool",
      title: "Open a site tool",
      description:
        "Navigate to a Convaudit tool page. This opens the interactive page but does not select files or submit data.",
      inputSchema: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description: "The slug from a tool URL, such as compress-image.",
          },
        },
        required: ["slug"],
        additionalProperties: false,
      },
      execute(input) {
        const tool = getToolBySlug(getSlug(input));
        if (!tool) {
          throw new Error("No tool exists with that slug.");
        }

        const path = `/tools/${tool.slug}`;
        router.push(path);
        return { opened: path, tool: tool.name };
      },
    },
  ];
}

export function WebMcpTools() {
  const router = useRouter();

  useEffect(() => {
    const modelContext =
      (document as Document & { modelContext?: WebMcpContext }).modelContext ??
      (navigator as Navigator & { modelContext?: WebMcpContext }).modelContext;

    if (!modelContext) return;

    const controller = new AbortController();
    for (const tool of createWebMcpTools(router)) {
      void modelContext.registerTool(tool, { signal: controller.signal }).catch(
        (error: unknown) => {
          if (!controller.signal.aborted) {
            console.error(`Failed to register WebMCP tool "${tool.name}".`, error);
          }
        },
      );
    }

    return () => controller.abort();
  }, [router]);

  return null;
}
