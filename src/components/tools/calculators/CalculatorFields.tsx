"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CalculatorNumberField({
  id,
  label,
  value,
  onChange,
  min = 0,
  step = 1,
  prefix,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  step?: number;
  prefix?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          id={id}
          type="number"
          min={min}
          step={step}
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={prefix ? "pl-7" : undefined}
        />
      </div>
    </div>
  );
}

export function CalculatorPrivacyNote() {
  return (
    <p className="text-sm text-muted-foreground">
      Your data never leaves your browser. This calculator does not connect to
      your account or upload your inputs.
    </p>
  );
}

export function calculatorNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

export function formatCalculatorCurrency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}
