import { CalculatorPageContent } from "@/components/tools/calculators/CalculatorPageContent";
import { CalculatorRenderer } from "@/components/tools/calculators/CalculatorRenderer";
import { TIKTOK_MONEY_CALCULATOR } from "@/lib/calculators";
import { buildCalculatorMetadata } from "@/lib/seo";

export const metadata = buildCalculatorMetadata(
  TIKTOK_MONEY_CALCULATOR,
);

export default function TikTokMoneyCalculatorPage() {
  return (
    <CalculatorPageContent calculator={TIKTOK_MONEY_CALCULATOR}>
      <CalculatorRenderer slug={TIKTOK_MONEY_CALCULATOR.slug} />
    </CalculatorPageContent>
  );
}
