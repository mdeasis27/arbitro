import type { TapeStatus } from "@/design-system/demo/outcome-tape";
import type { PlaybackFrame } from "@/design-system/demo/playback";
import type { TraceEvent } from "@/design-system/demo/types";
import type { CaseStatus, JudgedCase } from "./mission";

export function arbitroCells(items: readonly { status: CaseStatus }[], revealed: number): TapeStatus[] {
  return items.map((c, i) => (i >= revealed ? "pending" : c.status));
}

export function revealedPlays(frame: { visible: number; total: number; complete: boolean }, n: number, reducedMotion: boolean): number {
  if (reducedMotion || frame.complete || frame.total === 0) return n;
  return Math.ceil((n * frame.visible) / frame.total);
}

/** Index of the play being explained: the last one revealed, none once everything is shown. */
export function currentPlay(frame: { visible: number; total: number; complete: boolean }, n: number, reducedMotion: boolean): number | undefined {
  const visible = revealedPlays(frame, n, reducedMotion);
  return reducedMotion || frame.complete || visible === 0 || visible >= n ? undefined : visible - 1;
}

/** Where each play lands: reviewed plays on the video screen, the rest in the called bin, each in its next free slot. */
export function landing(statuses: readonly CaseStatus[]): { bin: "called" | "video"; slot: number }[] {
  let called = 0, video = 0;
  return statuses.map(s => (s === "rerouted" ? { bin: "video", slot: video++ } : { bin: "called", slot: called++ }));
}

export type PlayKind = "unanimous" | "called" | "thin" | "split" | "wrong";

/** Which sentence explains a play, from its real votes and outcome. */
export function playKind(c: Pick<JudgedCase, "status" | "count">): PlayKind {
  if (c.status === "lost") return "wrong";
  if (c.count === 1) return "split";
  if (c.status === "rerouted") return "thin";
  return c.count === 3 ? "unanimous" : "called";
}

export const COMPLETE_FRAME: PlaybackFrame<TraceEvent> = { visible: 0, total: 0, event: undefined, complete: true };
