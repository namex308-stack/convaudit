import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Convaudit",
    short_name: "Convaudit",
    description:
      "Free tools for images, PDFs and YouTube creator workflows. Processing varies by tool.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#4F46E5",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/favicon.ico",
        sizes: "16x16 32x32",
        type: "image/x-icon",
      },
    ],
  };
}
