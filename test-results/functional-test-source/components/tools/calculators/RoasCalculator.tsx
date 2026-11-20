"use client";

import { useState } from "react";
import {
  CalculatorNumberField,
  CalculatorPrivacyNote,
  calculatorNumber,
} from "./CalculatorFields";

export function RoasCalculator() {
  const [revenue, setRevenue] = useState("4000");
  const [spend, setSpend] = useState("1000");
  const attributedRevenue = calculatorNumber(revenue);
  const adSpend = calculatorNumber(spend);
  const roas = adSpend > 0 ? attributedRevenue / adSpend : null;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-2">
        <CalculatorNumberField
          id="roas-revenue"
          label="Ad-attributed revenue"
          value={revenue}
          onChange={setRevenue}
          step={0.01}
          prefix="$"
        />
        <CalculatorNumberField
          id="roas-spend"
          label="Advertising spend"
          value={spend}
          onChange={setSpend}
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
        <p className="text-sm font-medium opacity-75">Return on ad spend</p>
        <p className="mt-1 text-4xl font-bold tracking-tight">
          {roas === null ? "—" : `${roas.toFixed(2)}x`}
        </p>
        <p className="mt-2 text-sm opacity-75">
          {roas === null
            ? "Enter advertising spend above zero to calculate ROAS."
            : `${roas.toFixed(2)} in attributed revenue for each 1.00 spent.`}
        </p>
      </div>
    </div>
  );
}
