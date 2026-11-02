"use client";

import { useState } from "react";
import {
  CalculatorNumberField,
  CalculatorPrivacyNote,
  calculatorNumber,
  formatCalculatorCurrency,
} from "./CalculatorFields";

export function InfluencerRateCalculator() {
  const [averageViews, setAverageViews] = useState("10000");
  const [cpm, setCpm] = useState("25");
  const [deliverables, setDeliverables] = useState("1");
  const estimatedRate =
    (calculatorNumber(averageViews) / 1000) *
    calculatorNumber(cpm) *
    calculatorNumber(deliverables);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-2">
        <CalculatorNumberField
          id="influencer-average-views"
          label="Average views per post"
          value={averageViews}
          onChange={setAverageViews}
        />
        <CalculatorNumberField
          id="influencer-cpm"
          label="Target CPM (per 1,000 views)"
          value={cpm}
          onChange={setCpm}
          step={0.5}
          prefix="$"
        />
        <CalculatorNumberField
          id="influencer-deliverables"
          label="Number of deliverables"
          value={deliverables}
          onChange={setDeliverables}
        />
        <div className="flex items-end">
          <CalculatorPrivacyNote />
        </div>
      </div>
      <div
        aria-live="polite"
        className="rounded-xl bg-foreground p-6 text-background"
      >
        <p className="text-sm font-medium opacity-75">Estimated sponsorship quote</p>
        <p className="mt-1 text-4xl font-bold tracking-tight">
          {formatCalculatorCurrency(estimatedRate)}
        </p>
        <p className="mt-2 text-sm opacity-75">
          A starting estimate. Add separate fees for usage rights, exclusivity,
          or production where appropriate.
        </p>
      </div>
    </div>
  );
}
