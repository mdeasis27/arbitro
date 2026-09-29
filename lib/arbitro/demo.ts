// lib/arbitro/demo.ts
// Wires committed model outputs into every number the dashboard displays. The
// three "models" are committed, deterministic verdicts (a documented proxy for
// real model calls); the arbitration rule is real and shared with Python.

import casesRaw from "./data/cases.json";
import { benchmark } from "./benchmark";
import { arbitrate } from "./arbitrate";
import { pairwiseAgreement, tally } from "./agreement";
import type { ArbitrationResult, Case } from "./types";

const THRESHOLD = casesRaw.threshold as number;
const CASES = casesRaw.cases as unknown as Case[];

let memoBenchmark: ArbitrationResult | null = null;

export function getThreshold(): number {
  return THRESHOLD;
}

export function getCases(): Case[] {
  return CASES;
}

export function getBenchmark(): ArbitrationResult {
  if (!memoBenchmark) {
    memoBenchmark = benchmark(CASES, THRESHOLD);
  }
  return memoBenchmark;
}

export function getAgreement(): number {
  return pairwiseAgreement(CASES);
}

export function getCaseVerdicts() {
  return CASES.map((c) => ({
    id: c.id,
    gold: c.gold,
    a: c.a.label,
    b: c.b.label,
    c: c.c.label,
    confidences: { a: c.a.confidence, b: c.b.confidence, c: c.c.confidence },
    verdict: arbitrate(c, THRESHOLD),
    tally: [...tally(c).entries()],
  }));
}
