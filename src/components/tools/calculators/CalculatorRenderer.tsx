"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useInViewport } from "../useInViewport";

const calculatorComponents: Record<string, ComponentType> = {
  "engagement-rate-calculator": dynamic(() =>
    import("./EngagementRateCalculator").then(
      (module) => module.EngagementRateCalculator,
    ),
  ),
  "follower-growth-calculator": dynamic(() =>
    import("./FollowerGrowthCalculator").then(
      (module) => module.FollowerGrowthCalculator,
    ),
  ),
  "influencer-rate-calculator": dynamic(() =>
    import("./InfluencerRateCalculator").then(
      (module) => module.InfluencerRateCalculator,
    ),
  ),
  "roas-calculator": dynamic(() =>
    import("./RoasCalculator").then((module) => module.RoasCalculator),
  ),
  "tiktok-money-calculator": dynamic(() =>
    import("./TikTokMoneyCalculator").then(
      (module) => module.TikTokMoneyCalculator,
    ),
  ),
};

export function CalculatorRenderer({ slug }: { slug: string }) {
  const { ref, isInViewport } = useInViewport<HTMLDivElement>();
  const CalculatorComponent = calculatorComponents[slug];

  return (
    <div ref={ref} className="min-h-48">
      {isInViewport && CalculatorComponent ? <CalculatorComponent /> : null}
    </div>
  );
}
