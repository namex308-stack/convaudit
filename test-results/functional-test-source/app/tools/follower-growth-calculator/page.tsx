import { CalculatorPageContent } from "@/components/tools/calculators/CalculatorPageContent";
import { CalculatorRenderer } from "@/components/tools/calculators/CalculatorRenderer";
import { FOLLOWER_GROWTH_CALCULATOR } from "@/lib/calculators";
import { buildCalculatorMetadata } from "@/lib/seo";

export const metadata = buildCalculatorMetadata(
  FOLLOWER_GROWTH_CALCULATOR,
);

export default function FollowerGrowthCalculatorPage() {
  return (
    <CalculatorPageContent calculator={FOLLOWER_GROWTH_CALCULATOR}>
      <CalculatorRenderer slug={FOLLOWER_GROWTH_CALCULATOR.slug} />
    </CalculatorPageContent>
  );
}
