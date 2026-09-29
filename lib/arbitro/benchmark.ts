// lib/arbitro/benchmark.ts
// Agreement, escalation rate, and arbitration accuracy across the case set.

import { pairwiseAgreement } from "./agreement";
import { arbitrate } from "./arbitrate";
import type { ArbitrationResult, Case } from "./types";

function rate(a: number, b: number): number {
  return b === 0 ? 0 : a / b;
}

export function benchmark(cases: readonly Case[], threshold: number): ArbitrationResult {
  const agreement = pairwiseAgreement(cases);
  let arbitrated = 0;
  let arbitratedCorrect = 0;
  let escalated = 0;

  for (const c of cases) {
    const v = arbitrate(c, threshold);
    if (v.outcome === "escalated") {
      escalated++;
    } else {
      arbitrated++;
      if (v.label === c.gold) arbitratedCorrect++;
    }
  }

  return {
    agreement,
    escalationRate: rate(escalated, cases.length),
    arbitrated,
    arbitratedCorrect,
    arbitrationAccuracy: rate(arbitratedCorrect, arbitrated),
    n: cases.length,
  };
}
