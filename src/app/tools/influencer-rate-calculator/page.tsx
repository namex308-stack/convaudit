import { CalculatorPageContent } from "@/components/tools/calculators/CalculatorPageContent";
import { CalculatorRenderer } from "@/components/tools/calculators/CalculatorRenderer";
import { INFLUENCER_RATE_CALCULATOR } from "@/lib/calculators";
import { buildCalculatorMetadata } from "@/lib/seo";

export const metadata = buildCalculatorMetadata(
  INFLUENCER_RATE_CALCULATOR,
);

export default function InfluencerRateCalculatorPage() {
  return (
    <CalculatorPageContent calculator={INFLUENCER_RATE_CALCULATOR}>
      <CalculatorRenderer slug={INFLUENCER_RATE_CALCULATOR.slug} />
    </CalculatorPageContent>
  );
}
