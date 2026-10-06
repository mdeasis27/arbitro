import { arbitrate } from "@/lib/arbitro/arbitrate";
import { tally } from "@/lib/arbitro/agreement";
import { getCases } from "@/lib/arbitro/demo";
import type { ModelOutput } from "@/lib/arbitro/types";
import type { DemoAdapter, TraceEvent } from "./types";

export type CaseStatus = "served" | "rerouted" | "lost";
/** One play: its outcome plus the three votes, the label with most votes and that label's mean confidence. */
export type JudgedCase = { id: string; status: CaseStatus; gold: string; votes: ModelOutput[]; majority: string; count: number; confidence: number };
export type MissionInput = { threshold: number };
export type MissionResult = { items: JudgedCase[]; reviewed: number; wrong: number; comparison: { mine: number; without: number } };

/** Every committed case through the real arbitration rule: settled right, sent to review, or settled wrong. */
export function judgeCases(threshold: number): JudgedCase[] {
  return getCases().map(c => {
    const v = arbitrate(c, threshold);
    const majority = [...tally(c).entries()].sort((a, b) => b[1] - a[1])[0][0];
    const status: CaseStatus = v.outcome === "escalated" ? "rerouted" : v.label === c.gold ? "served" : "lost";
    return { id: c.id, status, gold: c.gold, votes: [c.a, c.b, c.c], majority, count: v.votes, confidence: v.confidence };
  });
}

/** Without the referee the label with most votes decides; tally keeps vote order, so a 3-way split falls to the first judge. */
export function pluralityWrong(): number {
  return getCases().filter(c => [...tally(c).entries()].sort((a, b) => b[1] - a[1])[0][0] !== c.gold).length;
}

export const runMission: DemoAdapter<MissionInput, MissionResult> = async (input, signal, onEvent) => {
  const startedAt = performance.now();
  const items = judgeCases(input.threshold);
  const trace: TraceEvent[] = [];
  // One event per play: the trace player's pace, speed and Show all drive the scene directly.
  for (const [i, c] of items.entries()) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    const event: TraceEvent = { id: `play-${i + 1}`, step: i + 1, kind: "arbitration", messageKey: `play.${c.status}`, timestampMs: performance.now() - startedAt, evidenceIds: [c.id] };
    trace.push(event);
    onEvent(event);
  }
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  const wrong = items.filter(i => i.status === "lost").length;
  const reviewed = items.filter(i => i.status === "rerouted").length;
  return { input, result: { items, reviewed, wrong, comparison: { mine: wrong, without: pluralityWrong() } }, trace, executionMs: performance.now() - startedAt, mode: "local" };
};
