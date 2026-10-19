"use client";

import { useEffect } from "react";
import { SITE_CONFIG } from "@/lib/tools";
import { usePrivacyConsent } from "./PrivacyConsent";

const ADSENSE_SCRIPT_ID = "adsbygoogle-init";
const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE_CONFIG.adsenseClient}`;

export function AdSenseScript() {
  const { optionalAllowed } = usePrivacyConsent();

  useEffect(() => {
    if (!SITE_CONFIG.adsenseClient || !optionalAllowed) return;

    const alreadyLoaded = [...document.scripts].some(
      (script) => script.src === ADSENSE_SCRIPT_SRC,
    );
    if (alreadyLoaded) return;

    const script = document.createElement("script");
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = ADSENSE_SCRIPT_SRC;
    script.onerror = () => {
      console.error("Failed to load the configured AdSense script.");
    };
    document.head.appendChild(script);
  }, [optionalAllowed]);

  return null;
}
