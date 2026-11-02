"use client";

import Script from "next/script";
import { SITE_CONFIG } from "@/lib/tools";
import { usePrivacyConsent } from "./PrivacyConsent";

const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE_CONFIG.adsenseClient}`;

export function AdSenseScript() {
  const { optionalAllowed } = usePrivacyConsent();

  if (!SITE_CONFIG.adsenseClient || !optionalAllowed) return null;

  return (
    <Script
      id="adsbygoogle-init"
      src={ADSENSE_SCRIPT_SRC}
      strategy="lazyOnload"
      crossOrigin="anonymous"
      onError={() => {
        console.error("Failed to load the configured AdSense script.");
      }}
    />
  );
}
