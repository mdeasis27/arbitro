import { arbitrate } from "@/lib/arbitro/arbitrate";
import type { Case, ModelOutput } from "@/lib/arbitro/types";
import type { DemoAdapter, TraceEvent } from "./types";
export type Candidate = ModelOutput;
export type ExperienceInput = { a: Candidate; b: Candidate; c: Candidate; threshold: number };
export type ExperienceResult = ReturnType<typeof arbitrate>;
export const runExperience: DemoAdapter<ExperienceInput, ExperienceResult> = async (input, signal, onEvent) => {
  const startedAt = performance.now();
  if (input.threshold < 0 || input.threshold > 1) throw new Error("Threshold must be between 0 and 1.");
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  const caseInput: Case = { id: "interactive", gold: input.a.label, a: input.a, b: input.b, c: input.c };
  const result = arbitrate(caseInput, input.threshold);
  const trace: TraceEvent[] = (["a", "b", "c"] as const).map((id, index) => ({ id, step: index + 1, kind: "vote", messageKey: input[id].label, timestampMs: performance.now() - startedAt }));
  const decision: TraceEvent = { id: "decision", step: 4, kind: "decision", messageKey: result.outcome, timestampMs: performance.now() - startedAt }; trace.push(decision); for (const event of trace) { if (signal.aborted) throw new DOMException("Aborted", "AbortError"); onEvent(event); if (signal.aborted) throw new DOMException("Aborted", "AbortError"); }
  return { input, result, trace, executionMs: performance.now() - startedAt, mode: "local" };
};
