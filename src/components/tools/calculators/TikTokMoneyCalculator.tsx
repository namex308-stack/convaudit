"use client";

import { useState } from "react";
import {
  CalculatorNumberField,
  CalculatorPrivacyNote,
  calculatorNumber,
  formatCalculatorCurrency,
} from "./CalculatorFields";
import { calculateTikTokEarnings } from "@/lib/calculators";

export function TikTokMoneyCalculator() {
  const [views, setViews] = useState("100000");
  const [rpm, setRpm] = useState("0.50");
  const estimatedEarnings = calculateTikTokEarnings(
    calculatorNumber(views),
    calculatorNumber(rpm),
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-2">
        <CalculatorNumberField
          id="tiktok-monthly-views"
          label="Monthly video views"
          value={views}
          onChange={setViews}
        />
        <CalculatorNumberField
          id="tiktok-rpm"
          label="Estimated RPM (per 1,000 views)"
          value={rpm}
          onChange={setRpm}
          step={0.01}
          prefix="$"
        />
        <div className="sm:col-span-2">
          <CalculatorPrivacyNote />
        </div>
      </div>
      <div
        aria-live="polite"
        className="rounded-xl bg-foreground p-6 text-background"
      >
        <p className="text-sm font-medium opacity-75">Estimated monthly earnings</p>
        <p className="mt-1 text-4xl font-bold tracking-tight">
          {formatCalculatorCurrency(estimatedEarnings)}
        </p>
        <p className="mt-2 text-sm opacity-75">
          Estimate only; actual creator payouts vary by program and qualified views.
        </p>
      </div>
    </div>
  );
}
