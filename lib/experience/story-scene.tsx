"use client";
import type { PlaybackFrame } from "@/design-system/demo/playback";
import type { TraceEvent } from "@/design-system/demo/types";
import { StoryStage } from "@/design-system/demo/decision-lab";
import { OutcomeTape, useReducedMotion } from "@/design-system/demo/project-story";
import { tapeCounts } from "@/design-system/demo/outcome-tape";
import type { CaseStatus, JudgedCase, MissionResult } from "./mission";
import { arbitroCells, currentPlay, landing, playKind, revealedPlays } from "./scene-state";
import { STORY } from "./story";

// Field in viewBox units: the called bin on the left, the video referee screen on the right, the judges' spot between them.
const CENTER = { x: 212, y: 96 };
const slotXY = (bin: "called" | "video", slot: number) => bin === "called"
  ? { x: 26 + (slot % 6) * 28, y: 52 + Math.floor(slot / 6) * 34 }
  : { x: 260 + (slot % 5) * 28, y: 58 + Math.floor(slot / 5) * 20 };
const FILL: Record<CaseStatus, string> = { served: "fill-success", rerouted: "fill-info", lost: "fill-danger" };
const TEXT: Record<CaseStatus, string> = { served: "text-success", rerouted: "text-info", lost: "text-danger" };
const pct = (x: number) => Math.round(x * 1000) / 10;

export function ArbitroStoryScene({ frame, result, threshold, locale }: { frame: PlaybackFrame<TraceEvent>; result: MissionResult; threshold: number; locale: "en" | "es" }) {
  const copy = STORY[locale].scene;
  const reduced = useReducedMotion();
  const items = result.items;
  const n = items.length;
  // The trace player sets the pace: one event per play, so speed and Show all apply here too.
  const visible = revealedPlays(frame, n, reduced);
  const at = currentPlay(frame, n, reduced);
  const current = at === undefined ? undefined : items[at];
  const settled = visible >= n && current === undefined;
  const cells = arbitroCells(items, visible);
  const c = tapeCounts(cells);
  const spots = landing(items.map(i => i.status));
  const t = pct(threshold);
  const label = (l: string) => copy.labels[l] ?? l;
  const line = (p: JudgedCase) => {
    const kind = playKind(p);
    if (kind === "unanimous") return copy.lines.unanimous(label(p.majority));
    if (kind === "split") return copy.lines.split();
    if (kind === "wrong") return copy.lines.wrong(label(p.majority), pct(p.confidence), label(p.gold));
    return copy.lines[kind](label(p.majority), pct(p.confidence), t);
  };
  const summary = copy.summary(t, c.served, c.rerouted, c.lost);
  const reviewed = copy.reviewedOf(c.rerouted, n);

  return <StoryStage locale={locale} title={copy.title} caption={copy.caption} step={frame.visible} total={frame.total}>
    <div data-arbitro-scene className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
        <span>{copy.playOf(visible, n)}</span>
        <span data-scoreboard className="text-foreground">{reviewed}</span>
      </div>
      <svg role="img" aria-label={`${reviewed}. ${summary}`} viewBox="0 0 400 200" className="mt-3 h-auto w-full">
        <text x={96} y={22} textAnchor="middle" className="fill-foreground text-[15px] font-medium">{copy.calledBin}</text>
        <rect x={8} y={32} width={176} height={160} rx={8} className="fill-none stroke-border" strokeDasharray="4 4" />
        <text x={316} y={22} textAnchor="middle" className="fill-foreground text-[15px] font-medium">{copy.video}</text>
        <line x1={300} y1={42} x2={290} y2={32} className="stroke-muted-foreground" strokeWidth={2} />
        <line x1={332} y1={42} x2={342} y2={32} className="stroke-muted-foreground" strokeWidth={2} />
        <rect x={240} y={42} width={152} height={124} rx={8} className="fill-info/10 stroke-info" strokeWidth={2} />
        <rect x={302} y={166} width={28} height={10} className="fill-muted-foreground" />
        <circle cx={CENTER.x} cy={CENTER.y} r={16} className="fill-none stroke-border" strokeDasharray="3 3" />
        {items.slice(0, visible).map((p, i) => {
          const at = p === current ? CENTER : slotXY(spots[i].bin, spots[i].slot);
          return <g key={p.id} data-ball={p.status} style={{ transform: `translate(${at.x}px, ${at.y}px)` }} className="transition-transform duration-500 ease-in-out motion-reduce:transition-none">
            <circle r={9} className={`${FILL[p.status]} stroke-surface`} strokeWidth={2} />
            {p.status === "lost" ? <path d="M-4 -4L4 4M4 -4L-4 4" stroke="white" strokeWidth={2.5} strokeLinecap="round" /> : null}
          </g>;
        })}
      </svg>

      <div className={`mt-4 ${settled ? "" : "min-h-[9.5rem]"}`}>
        {current ? <>
          <ol className="grid grid-cols-3 gap-2" aria-label={copy.playOf(visible, n)}>
            {current.votes.map((v, j) => {
              const odd = current.count > 1 && v.label !== current.majority;
              return <li key={j} data-judge-card className={`min-w-0 rounded-lg border border-border bg-background p-2 text-center transition-opacity duration-300 motion-reduce:transition-none ${odd ? "opacity-50" : ""}`}>
                <p className="truncate text-[11px] text-muted-foreground">{copy.judge(j + 1)}</p>
                <p className="truncate text-sm font-semibold">{label(v.label)}</p>
                <p className="font-mono text-xs">{pct(v.confidence)}%</p>
              </li>;
            })}
          </ol>
          <p className={`mt-3 text-sm font-semibold ${TEXT[current.status]}`}>{copy.verdict[current.status]}</p>
          <p data-play-line className="mt-1 text-sm leading-6">{line(current)}</p>
        </> : null}
        {/* The only live region: announced once, when every play is in. */}
        <p data-scene-summary className={settled ? "text-sm leading-6" : "sr-only"} aria-live="polite">{settled ? summary : ""}</p>
      </div>

      <div className="mt-4">
        <OutcomeTape cells={cells} labels={copy.tape} ariaLabel={copy.tapeLabel} columns={11} />
      </div>
    </div>
  </StoryStage>;
}
