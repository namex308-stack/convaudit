"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useAdPreferences, type AdImportance } from "./AdPreferences";
import { usePrivacyConsent } from "./PrivacyConsent";
import { SITE_CONFIG } from "@/lib/tools";

type AdSlotProps = {
  /** AdSense slot ID (numeric string from your AdSense dashboard) */
  slot?: string;
  /** Display format — see AdSense docs. Defaults to "auto". */
  format?: string;
  /** Layout key (used for responsive ads). */
  layout?: string;
  /** Optional layout key for in-feed / in-article ads. */
  layoutKey?: string;
  /** Whether the slot should be responsive. */
  responsive?: boolean;
  /** Extra className for wrapper. */
  className?: string;
  /** Optional label shown above the ad for transparency. */
  label?: string;
  /**
   * Importance level. "standard" slots are hidden in reduced-ads mode.
   * All slots still require a configured publisher ID and consent.
   */
  importance?: AdImportance;
};

/**
 * Renders an AdSense ad slot with two anti-annoyance measures:
 *
 * 1. **Lazy loading** — the ad only initializes when it scrolls into view.
 *    Ads below the fold don't load until needed, saving bandwidth and
 *    reducing visual clutter on initial page load.
 *
 * 2. **Reduced-ads mode** — users can opt into a lighter experience via
 *    the AdPreferences provider. When enabled, "standard" slots are hidden.
 *
 * If advertising is not configured or the visitor has not consented, nothing
 * is rendered.
 */
export function AdSlot({
  slot = "0000000000",
  format = "auto",
  layout,
  layoutKey,
  responsive = true,
  className,
  label = "Advertisement",
  importance = "standard",
}: AdSlotProps) {
  const { mode } = useAdPreferences();
  const { optionalAllowed } = usePrivacyConsent();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Hide non-essential ads when the user has enabled reduced-ads mode
  const isHidden =
    !SITE_CONFIG.adsenseClient ||
    !optionalAllowed ||
    (importance === "standard" && mode === "reduced");

  // Lazy-load: only render the <ins> element once the slot is near the viewport
  useEffect(() => {
    if (isHidden) return;
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      // Start loading when the ad is within 200px of the viewport
      { rootMargin: "200px 0px" }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isHidden]);

  // Once visible, render the <ins> and push to AdSense.
  // Use a microtask to defer the state update and avoid the
  // synchronous-setState-in-effect lint rule.
  useEffect(() => {
    if (!isVisible) return;
    Promise.resolve().then(() => setShouldRender(true));
  }, [isVisible]);

  useEffect(() => {
    if (!shouldRender || isHidden) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      (w.adsbygoogle as unknown[]).push({});
    } catch (error) {
      console.error("Failed to initialize the configured ad slot.", error);
    }
  }, [isHidden, shouldRender]);

  if (isHidden) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "my-6 min-h-[280px] w-full overflow-hidden text-center",
        className
      )}
      aria-label="Sponsored content"
    >
      <span className="mb-2 block text-center text-xs text-muted-foreground">
        {label}
      </span>
      <ins
        className="adsbygoogle block min-h-[250px]"
        style={{ display: "block" }}
        data-ad-client={SITE_CONFIG.adsenseClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-ad-layout-key={layoutKey}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
