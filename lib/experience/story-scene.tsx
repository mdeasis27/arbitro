"use client";
import type { PlaybackFrame } from "@/design-system/demo/playback";
import type { TraceEvent } from "@/design-system/demo/types";
import { StoryStage } from "@/design-system/demo/decision-lab";
import { OutcomeTape, useReducedMotion } from "@/design-system/demo/project-story";
import { tapeCounts } from "@/design-system/demo/outcome-tape";
import { FlowDiagram, type FlowTone } from "@/design-system/demo/flow-diagram";
import type { MissionResult } from "./mission";
import { arbitroCells, revealedPlays } from "./scene-state";
import { STORY } from "./story";

const POS = { plays: { x: 10, y: 95 }, judges: { x: 230, y: 95 }, settled: { x: 470, y: 20 }, referee: { x: 470, y: 170 } } as const;

export function ArbitroStoryScene({ frame, result, locale }: { frame: PlaybackFrame<TraceEvent>; result: MissionResult; locale: "en" | "es" }) {
  const copy = STORY[locale].scene;
  const reduced = useReducedMotion();
  const cells = arbitroCells(result.items, revealedPlays(frame, result.items.length, reduced));
  const c = tapeCounts(cells);
  const tone: Record<keyof typeof POS, FlowTone> = {
    plays: "idle",
    judges: "active",
    settled: c.lost > 0 ? "danger" : c.served > 0 ? "success" : "idle",
    referee: c.rerouted > 0 ? "success" : "idle",
  };
  const nodes = (Object.keys(POS) as (keyof typeof POS)[]).map(id => ({ id, ...POS[id], ...copy.nodes[id], tone: tone[id] }));
  return <StoryStage locale={locale} title={copy.title} caption={copy.caption} step={frame.visible} total={frame.total}>
    <FlowDiagram nodes={nodes} width={640} height={260} ariaLabel={copy.reviewedOf(c.rerouted, result.items.length)} statusLabels={copy.statusLabels} edges={[
      { from: "plays", to: "judges" },
      { from: "judges", to: "settled", tone: c.lost > 0 ? "danger" : c.served > 0 ? "success" : "idle" },
      { from: "judges", to: "referee", tone: c.rerouted > 0 ? "success" : "idle" },
    ]} />
    <div className="mt-6">
      <OutcomeTape cells={cells} labels={copy.tape} ariaLabel={copy.tapeLabel} columns={11} />
      <p className="mt-4 font-mono text-2xl font-semibold tracking-tight">{copy.reviewedOf(c.rerouted, result.items.length)}</p>
    </div>
  </StoryStage>;
}
