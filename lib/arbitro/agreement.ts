// lib/arbitro/agreement.ts
// Inter-model agreement (mean pairwise agreement over labels) and vote tallying.
// Mirrors backend/src/arbitro/agreement.py.

import { MODELS, type Case, type ModelId, type ModelOutput } from "./types";

function outputs(c: Case): Record<ModelId, ModelOutput> {
  return { a: c.a, b: c.b, c: c.c };
}

export function pairwiseAgreement(cases: readonly Case[]): number {
  const pairs: [ModelId, ModelId][] = [
    [MODELS[0], MODELS[1]],
    [MODELS[0], MODELS[2]],
    [MODELS[1], MODELS[2]],
  ];
  const agreements = pairs.map(([x, y]) => {
    const agreed = cases.filter((c) => outputs(c)[x].label === outputs(c)[y].label).length;
    return agreed / cases.length;
  });
  return agreements.reduce((s, a) => s + a, 0) / agreements.length;
}

export function tally(c: Case): Map<string, number> {
  const votes = new Map<string, number>();
  for (const m of MODELS) {
    const label = outputs(c)[m].label;
    votes.set(label, (votes.get(label) ?? 0) + 1);
  }
  return votes;
}

export function meanConfidence(c: Case, label: string): number {
  const members = MODELS.filter((m) => outputs(c)[m].label === label);
  const sum = members.reduce((s, m) => s + outputs(c)[m].confidence, 0);
  return sum / members.length;
}
