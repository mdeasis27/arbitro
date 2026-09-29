// lib/arbitro/types.ts
// Core data shapes for the LLM output arbitration demo. Plain JSON-serializable
// shapes mirrored one-to-one in backend/src/arbitro/types.py.

export const MODELS = ["a", "b", "c"] as const;
export type ModelId = (typeof MODELS)[number];

export interface ModelOutput {
  label: string;
  confidence: number;
}

export interface Case {
  id: string;
  gold: string;
  a: ModelOutput;
  b: ModelOutput;
  c: ModelOutput;
}

export interface Verdict {
  outcome: "arbitrated" | "escalated";
  label: string | null;
  votes: number;
  confidence: number;
}

export interface ArbitrationResult {
  agreement: number;
  escalationRate: number;
  arbitrated: number;
  arbitratedCorrect: number;
  arbitrationAccuracy: number;
  n: number;
}
