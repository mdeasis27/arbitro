// lib/arbitro/arbitrate.ts
// The deterministic arbitration rule. A unanimous verdict arbitrates; a 2-vs-1
// majority arbitrates only if the winning label's mean confidence clears the
// threshold (otherwise the thin majority escalates); a 3-way split always
// escalates. Mirrors backend/src/arbitro/arbitrate.py.

import { meanConfidence, tally } from "./agreement";
import type { Case, Verdict } from "./types";

export function arbitrate(c: Case, threshold: number): Verdict {
  const votes = tally(c);
  const top = [...votes.entries()].sort((a, b) => b[1] - a[1])[0];
  const [label, count] = top;

  if (count === 3) {
    return { outcome: "arbitrated", label, votes: count, confidence: meanConfidence(c, label) };
  }

  if (count === 2) {
    const confidence = meanConfidence(c, label);
    if (confidence >= threshold) {
      return { outcome: "arbitrated", label, votes: count, confidence };
    }
    return { outcome: "escalated", label: null, votes: count, confidence };
  }

  return { outcome: "escalated", label: null, votes: count, confidence: meanConfidence(c, label) };
}
