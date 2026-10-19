import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Convaudit",
    short_name: "Convaudit",
    description:
      "Free tools for images, PDFs and YouTube creator workflows. Processing varies by tool.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0f19",
    theme_color: "#0f172a",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
