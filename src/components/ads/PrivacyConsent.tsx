"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_CONFIG } from "@/lib/tools";

type ConsentChoice = "accepted" | "rejected" | null;

type PrivacyConsent = {
  optionalAllowed: boolean;
  showSettings: () => void;
  setChoice: (choice: Exclude<ConsentChoice, null>) => void;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = "convaudit-optional-consent";
const PrivacyConsentContext = createContext<PrivacyConsent | null>(null);

// TODO_OWNER: Replace this temporary consent control with the certified CMP
// and CMP ID required for EEA/UK advertising.
function updateGoogleConsent(choice: Exclude<ConsentChoice, null>) {
  window.gtag?.("consent", "update", {
    ad_storage: choice === "accepted" ? "granted" : "denied",
    ad_user_data: choice === "accepted" ? "granted" : "denied",
    ad_personalization: choice === "accepted" ? "granted" : "denied",
    analytics_storage: choice === "accepted" ? "granted" : "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "denied",
  });
}

export function PrivacyConsentProvider({ children }: { children: ReactNode }) {
  const [choice, setChoiceState] = useState<ConsentChoice>(null);
  const [bannerOpen, setBannerOpen] = useState(true);

  useEffect(() => {
    let isActive = true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "accepted" || saved === "rejected") {
        Promise.resolve().then(() => {
          if (!isActive) return;
          setChoiceState(saved);
          setBannerOpen(false);
        });
      }
    } catch (error) {
      console.warn("[privacy-consent] Could not read saved consent:", error);
    }
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (choice) updateGoogleConsent(choice);
  }, [choice]);

  const setChoice = useCallback((nextChoice: Exclude<ConsentChoice, null>) => {
    setChoiceState(nextChoice);
    setBannerOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, nextChoice);
    } catch (error) {
      console.warn("[privacy-consent] Could not save consent:", error);
    }
    updateGoogleConsent(nextChoice);
  }, []);

  const showSettings = useCallback(() => setBannerOpen(true), []);

  return (
    <PrivacyConsentContext.Provider
      value={{ optionalAllowed: choice === "accepted", showSettings, setChoice }}
    >
      {children}
      {bannerOpen && (
        <section
          aria-label="Privacy choices"
          aria-live="polite"
          className="fixed inset-x-0 bottom-0 z-[100] border-t bg-background p-4 shadow-2xl sm:p-6"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-sm font-semibold">Privacy choices</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Optional analytics ({SITE_CONFIG.analyticsProvider})
                {SITE_CONFIG.adsenseClient
                  ? " and advertising (Google AdSense)"
                  : ""}{" "}
                are off unless you allow them.
                This choice is saved in this browser and can be changed later
                with Privacy settings.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setChoice("rejected")}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Reject optional
              </button>
              <button
                type="button"
                onClick={() => setChoice("accepted")}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Allow optional
              </button>
            </div>
          </div>
        </section>
      )}
    </PrivacyConsentContext.Provider>
  );
}

export function usePrivacyConsent(): PrivacyConsent {
  const context = useContext(PrivacyConsentContext);
  if (!context) {
    throw new Error("usePrivacyConsent must be used within PrivacyConsentProvider.");
  }
  return context;
}

export function ConsentManagedScripts() {
  const { optionalAllowed } = usePrivacyConsent();
  if (!optionalAllowed) return null;

  return (
    <>
      <Script
        id="ga-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${SITE_CONFIG.analyticsMeasurementId}`}
        onLoad={() => {
          window.gtag?.("js", new Date());
          window.gtag?.("config", SITE_CONFIG.analyticsMeasurementId, {
            anonymize_ip: true,
            cookie_flags: "SameSite=None;Secure",
          });
        }}
        onError={() => {
          console.error("Failed to load the configured Google Analytics script.");
        }}
      />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export function PrivacySettingsButton() {
  const { showSettings } = usePrivacyConsent();

  return (
    <button
      type="button"
      onClick={showSettings}
      className="text-left text-muted-foreground transition-colors hover:text-foreground"
    >
      Privacy settings
    </button>
  );
}
