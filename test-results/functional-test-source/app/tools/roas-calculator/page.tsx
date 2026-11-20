import { CalculatorPageContent } from "@/components/tools/calculators/CalculatorPageContent";
import { CalculatorRenderer } from "@/components/tools/calculators/CalculatorRenderer";
import { ROAS_CALCULATOR } from "@/lib/calculators";
import { buildCalculatorMetadata } from "@/lib/seo";

export const metadata = buildCalculatorMetadata(ROAS_CALCULATOR);

export default function RoasCalculatorPage() {
  return (
    <CalculatorPageContent calculator={ROAS_CALCULATOR}>
      <CalculatorRenderer slug={ROAS_CALCULATOR.slug} />
    </CalculatorPageContent>
  );
}
