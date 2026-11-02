"use client";

import { useState } from "react";
import {
  CalculatorNumberField,
  CalculatorPrivacyNote,
  calculatorNumber,
} from "./CalculatorFields";

export function FollowerGrowthCalculator() {
  const [startingFollowers, setStartingFollowers] = useState("10000");
  const [endingFollowers, setEndingFollowers] = useState("11250");
  const start = calculatorNumber(startingFollowers);
  const end = calculatorNumber(endingFollowers);
  const netChange = end - start;
  const growthRate = start > 0 ? (netChange / start) * 100 : null;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-2">
        <CalculatorNumberField
          id="follower-starting-count"
          label="Starting followers"
          value={startingFollowers}
          onChange={setStartingFollowers}
        />
        <CalculatorNumberField
          id="follower-ending-count"
          label="Ending followers"
          value={endingFollowers}
          onChange={setEndingFollowers}
        />
        <div className="sm:col-span-2">
          <CalculatorPrivacyNote />
        </div>
      </div>
      <div
        aria-live="polite"
        className="rounded-xl bg-foreground p-6 text-background"
      >
        <p className="text-sm font-medium opacity-75">Follower growth rate</p>
        <p className="mt-1 text-4xl font-bold tracking-tight">
          {growthRate === null ? "—" : `${growthRate.toFixed(2)}%`}
        </p>
        <p className="mt-2 text-sm opacity-75">
          {growthRate === null
            ? "Starting followers must be greater than zero."
            : `${Math.abs(netChange).toLocaleString("en-US")} ${netChange < 0 ? "followers lost" : "followers gained"}.`}
        </p>
      </div>
    </div>
  );
}
