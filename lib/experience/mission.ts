import { arbitrate } from "@/lib/arbitro/arbitrate";
import { tally } from "@/lib/arbitro/agreement";
import { getCases } from "@/lib/arbitro/demo";
import type { DemoAdapter, TraceEvent } from "./types";

export type CaseStatus = "served" | "rerouted" | "lost";
export type JudgedCase = { id: string; status: CaseStatus };
export type MissionInput = { threshold: number };
export type MissionResult = { items: JudgedCase[]; reviewed: number; wrong: number; comparison: { mine: number; without: number } };

const STEP = 6;

/** Every committed case through the real arbitration rule: settled right, sent to review, or settled wrong. */
export function judgeCases(threshold: number): JudgedCase[] {
  return getCases().map(c => {
    const v = arbitrate(c, threshold);
    return { id: c.id, status: v.outcome === "escalated" ? "rerouted" : v.label === c.gold ? "served" : "lost" };
  });
}

/** Without the referee the most voted label decides every case (a 3-way split falls to the first label). */
export function pluralityWrong(): number {
  return getCases().filter(c => [...tally(c).entries()].sort((a, b) => b[1] - a[1])[0][0] !== c.gold).length;
}

export const runMission: DemoAdapter<MissionInput, MissionResult> = async (input, signal, onEvent) => {
  const startedAt = performance.now();
  const items = judgeCases(input.threshold);
  const trace: TraceEvent[] = [];
  for (let i = 0; i < items.length; i += STEP) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    const event: TraceEvent = { id: `batch-${i / STEP + 1}`, step: i / STEP + 1, kind: "arbitration", messageKey: `batch.${i / STEP + 1}`, timestampMs: performance.now() - startedAt, evidenceIds: items.slice(i, i + STEP).map(c => c.id) };
    trace.push(event);
    onEvent(event);
  }
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  const wrong = items.filter(i => i.status === "lost").length;
  const reviewed = items.filter(i => i.status === "rerouted").length;
  return { input, result: { items, reviewed, wrong, comparison: { mine: wrong, without: pluralityWrong() } }, trace, executionMs: performance.now() - startedAt, mode: "local" };
};
