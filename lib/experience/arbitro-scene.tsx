import type { PlaybackFrame } from "@/design-system/demo/playback";
import type { TraceEvent } from "@/design-system/demo/types";
import { OutcomeBlock, StoryStage } from "@/design-system/demo/decision-lab";
import type { ExperienceInput, ExperienceResult } from "./adapter";

const spanishLabels: Record<string, string> = {
  approve: "aprobar",
  deny: "denegar",
  review: "revisión",
  arbitrated: "resuelto",
  escalated: "escalado",
};

const labelCopy = (label: string, locale: "en" | "es") => {
  if (locale === "en") return label;
  return spanishLabels[label] ?? label;
};

export function ArbitroScene({ frame, input, result, locale }: { frame: PlaybackFrame<TraceEvent>; input: ExperienceInput; result: ExperienceResult; locale: "en" | "es" }) {
  const es = locale === "es";
  const candidates = [input.a, input.b, input.c];

  return <StoryStage locale={locale} title={es ? "Convergencia de votos" : "Vote convergence"} caption={es ? "Cada boleta muestra una etiqueta y confianza del escenario, no una probabilidad calibrada." : "Each ballot shows a scenario label and confidence, not a calibrated probability."} step={frame.visible} total={frame.total}>
    <svg role="img" aria-label={es ? "Boletas convergiendo" : "Ballots converging"} viewBox="0 0 440 190" className="h-56 w-full">
      {candidates.map((candidate, index) => {
        const visible = index < frame.visible;
        return <g key={index} opacity={visible ? 1 : .3}>
          <circle cx="70" cy={40 + index * 55} r="20" className="fill-accent/20 stroke-accent" />
          <text x="47" y={44 + index * 55} className="fill-foreground text-[10px]">{visible ? labelCopy(candidate.label, locale) : "…"}</text>
          <path d={`M90 ${40 + index * 55}L245 95`} className="stroke-accent" strokeWidth="3" />
          <text x="125" y={35 + index * 55} className="fill-foreground text-[10px]">{visible ? candidate.confidence.toFixed(2) : "—"}</text>
        </g>;
      })}
      <circle cx="285" cy="95" r="38" className={frame.complete ? (result.outcome === "arbitrated" ? "fill-success/25 stroke-success" : "fill-warning/25 stroke-warning") : "fill-muted stroke-border"} />
      <text x="258" y="100" className="fill-foreground text-[10px]">{frame.complete ? labelCopy(result.outcome, locale) : "…"}</text>
    </svg>
    {frame.complete && <OutcomeBlock tone={result.outcome === "arbitrated" ? "success" : "warning"} title={result.outcome === "arbitrated" ? (es ? "Decisión resuelta" : "Decision resolved") : (es ? "Escalado a revisión" : "Escalated to review")} explanation={es ? `${result.votes}/3 votos y confianza ${result.confidence.toFixed(2)} con umbral ${input.threshold.toFixed(2)}.` : `${result.votes}/3 votes and confidence ${result.confidence.toFixed(2)} at threshold ${input.threshold.toFixed(2)}.`} />}
  </StoryStage>;
}
