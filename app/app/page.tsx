"use client";

import { useState } from "react";
import Link from "next/link";
import { Alert } from "@/design-system/components/alert";
import { Card } from "@/design-system/components/card";
import { MetricCard } from "@/design-system/components/metric-card";
import { StatusBadge } from "@/design-system/components/status-badge";
import { arbitrate } from "@/lib/arbitro/arbitrate";
import type { Case, Verdict } from "@/lib/arbitro/types";
import { getBenchmark } from "@/lib/arbitro/demo";

const BENCH = getBenchmark();
const LABELS = ["approve", "deny", "review"] as const;
type Label = (typeof LABELS)[number];

function pct(v: number) {
  return `${(v * 100).toFixed(0)}%`;
}

function ModelControls({
  name,
  value,
  onChange,
}: {
  name: string;
  value: { label: Label; confidence: number };
  onChange: (v: { label: Label; confidence: number }) => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Modelo {name}
        </span>
        <span className="font-mono text-sm text-foreground">{value.label}</span>
      </div>
      <select
        value={value.label}
        onChange={(e) => onChange({ ...value, label: e.target.value as Label })}
        className="mb-3 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/60"
      >
        {LABELS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">Confianza</span>
        <span className="font-mono text-xs tabular-nums text-foreground">
          {value.confidence.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value.confidence}
        onChange={(e) => onChange({ ...value, confidence: Number(e.target.value) })}
        className="w-full accent-foreground"
      />
    </Card>
  );
}

export default function AppPage() {
  const [a, setA] = useState<{ label: Label; confidence: number }>({ label: "approve", confidence: 0.9 });
  const [b, setB] = useState<{ label: Label; confidence: number }>({ label: "approve", confidence: 0.85 });
  const [c, setC] = useState<{ label: Label; confidence: number }>({ label: "deny", confidence: 0.7 });
  const [threshold, setThreshold] = useState(0.6);
  const [result, setResult] = useState<Verdict | null>(null);

  function run() {
    const caseObj: Case = { id: "custom", gold: "", a, b, c };
    setResult(arbitrate(caseObj, threshold));
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              Inicio
            </Link>
            <div className="h-4 w-px bg-[var(--border)]" aria-hidden="true" />
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <svg className="h-4 w-4 text-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18a2.25 2.25 0 0 0 2.25 2.25h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.5A2.25 2.25 0 0 0 20.25 14.25h-1.5A2.25 2.25 0 0 0 16.5 16.5v1.5Zm-9 0A2.25 2.25 0 0 1 5.25 20.25h-1.5A2.25 2.25 0 0 1 1.5 18v-1.5A2.25 2.25 0 0 1 3.75 14.25h1.5A2.25 2.25 0 0 1 7.5 16.5v1.5Zm9-7.5a2.25 2.25 0 0 1 2.25-2.25h1.5a2.25 2.25 0 0 1 2.25 2.25v1.5a2.25 2.25 0 0 1-2.25 2.25h-1.5A2.25 2.25 0 0 1 16.5 12v-1.5Zm-9 0A2.25 2.25 0 0 0 5.25 3.75h-1.5A2.25 2.25 0 0 0 1.5 6v1.5A2.25 2.25 0 0 0 3.75 9.75h1.5A2.25 2.25 0 0 0 7.5 7.5V6Zm9-4.5a2.25 2.25 0 0 0-2.25 2.25v1.5a2.25 2.25 0 0 0 2.25 2.25h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.5A2.25 2.25 0 0 0 20.25 1.5h-1.5A2.25 2.25 0 0 0 21.75 3.75v-1.5Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground leading-tight">Arbitro</h1>
                <p className="text-xs text-muted-foreground">Arbitraje de salidas de modelos</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge tone="info" dot className="px-3 py-1">
              Demo mode
            </StatusBadge>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {/* ── SUMMARY ─────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MetricCard label="Acuerdo entre modelos" value={pct(BENCH.agreement)} hint="pairwise medio" tone="info" />
          <MetricCard label="Escalado a humano" value={pct(BENCH.escalationRate)} hint="sin consenso claro" tone="warning" />
          <MetricCard label="Precisión del arbitraje" value={pct(BENCH.arbitrationAccuracy)} hint={`${BENCH.arbitratedCorrect}/${BENCH.arbitrated} correctos`} tone="success" />
          <MetricCard label="Umbral de confianza" value={BENCH.n === 0 ? 0 : 0.6} hint="para mayoría 2-vs-1" tone="neutral" />
        </div>

        {/* ── PLAYGROUND ──────────────────────── */}
        <section>
          <h2 className="text-lg font-semibold tracking-tight text-foreground mb-1">Arbitraje en vivo</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Configura el veredicto y la confianza de tres modelos y ejecuta el árbitro. Prueba un
            empate a tres vías, o una mayoría frágil (2 votos con confianza bajo el umbral).
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <ModelControls name="a" value={a} onChange={setA} />
            <ModelControls name="b" value={b} onChange={setB} />
            <ModelControls name="c" value={c} onChange={setC} />
          </div>

          <Card className="mt-4 p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-foreground">Umbral de confianza</span>
              <span className="font-mono text-sm tabular-nums text-foreground">{threshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={0.9}
              step={0.01}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-foreground"
            />
            <button
              onClick={run}
              className="mt-3 w-full rounded-[var(--radius-md)] bg-accent px-4 py-2.5 text-sm font-medium text-[#ffffff] hover:bg-accent/90 transition-colors"
            >
              Ejecutar arbitraje
            </button>
          </Card>

          {result && (
            <Card className="mt-4 p-5">
              <div className="flex items-center gap-3">
                {result.outcome === "arbitrated" ? (
                  <StatusBadge tone="success" dot>arbitrado</StatusBadge>
                ) : (
                  <StatusBadge tone="warning" dot>escalado a humano</StatusBadge>
                )}
                <span className="text-sm text-muted-foreground">
                  {result.outcome === "arbitrated"
                    ? `Veredicto: ${result.label}`
                    : "Sin consenso claro — requiere revisión humana"}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Votos</p>
                  <p className="font-semibold text-foreground">{result.votes}/3</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Confianza media</p>
                  <p className="font-semibold text-foreground">{result.confidence.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Umbral</p>
                  <p className="font-semibold text-foreground">{threshold.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          )}
        </section>

        {/* ── RULE NOTE ───────────────────────── */}
        <section>
          <Alert tone="info" title="La regla de arbitraje">
            Unánime → arbitra. Mayoría 2-vs-1 → arbitra solo si la confianza media de la etiqueta
            ganadora ≥ umbral; si no, escala. Empate a tres vías → escala. La confianza distingue
            un acuerdo real de uno frágil, y el escalado es donde se paga el coste de no saber.
          </Alert>
        </section>

        <footer className="pt-8 border-t border-[var(--border)] flex items-center justify-between text-xs text-muted-foreground">
          <span>Arbitro · LLM output arbitration · Demo mode</span>
          <a href="https://github.com/mdeasis27/arbitro" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors font-mono">GitHub</a>
        </footer>
      </div>
    </div>
  );
}
