"use client";

import Link from "next/link";
import { Alert } from "@/design-system/components/alert";
import { MetricCard } from "@/design-system/components/metric-card";
import { StatusBadge } from "@/design-system/components/status-badge";
import { getBenchmark, getCaseVerdicts, getThreshold } from "@/lib/arbitro/demo";

const BENCH = getBenchmark();
const VERDICTS = getCaseVerdicts();
const THRESHOLD = getThreshold();

function pct(v: number) {
  return `${(v * 100).toFixed(1)}%`;
}

export default function AppPage() {
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
        {/* ── SUMMARY BAR ─────────────────────── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MetricCard
            label="Acuerdo entre modelos"
            value={pct(BENCH.agreement)}
            hint="pairwise medio (a·b·c)"
            tone="info"
          />
          <MetricCard
            label="Escalado a humano"
            value={pct(BENCH.escalationRate)}
            hint="sin consenso claro"
            tone="warning"
          />
          <MetricCard
            label="Precisión del arbitraje"
            value={pct(BENCH.arbitrationAccuracy)}
            hint={`${BENCH.arbitratedCorrect}/${BENCH.arbitrated} correctos`}
            tone="success"
          />
          <MetricCard
            label="Umbral de confianza"
            value={THRESHOLD}
            hint="para mayoría 2-vs-1"
            tone="neutral"
          />
        </div>

        {/* ── CASES ───────────────────────────── */}
        <section>
          <h2 className="text-lg font-semibold tracking-tight text-foreground mb-1">Casos y veredictos</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Tres modelos votan {""}approve / deny / review{""}. Unánime arbitra; mayoría 2-vs-1
            arbitra solo si la confianza media supera el umbral; empate a tres vías escala. Los
            casos c21–c22 muestran el límite: una mayoría confiada que se equivoca.
          </p>
          <div className="overflow-x-auto rounded-[var(--radius-md)] shadow-[var(--shadow-card)] bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--gray-50)]">
                  <th scope="col" className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Caso</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">a</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">b</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">c</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">gold</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Veredicto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {VERDICTS.map((c) => {
                  const isWrong = c.verdict.outcome === "arbitrated" && c.verdict.label !== c.gold;
                  const isEscalated = c.verdict.outcome === "escalated";
                  return (
                    <tr key={c.id}>
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                      <td className="px-3 py-3 font-semibold text-foreground">{c.a}</td>
                      <td className="px-3 py-3 font-semibold text-foreground">{c.b}</td>
                      <td className="px-3 py-3 font-semibold text-foreground">{c.c}</td>
                      <td className="px-3 py-3 text-muted-foreground">{c.gold}</td>
                      <td className="px-4 py-3 text-right">
                        {isEscalated ? (
                          <StatusBadge tone="warning">escalado</StatusBadge>
                        ) : isWrong ? (
                          <StatusBadge tone="danger">mayoría errónea</StatusBadge>
                        ) : (
                          <StatusBadge tone="success">{c.verdict.label}</StatusBadge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── RULE NOTE ───────────────────────── */}
        <section>
          <Alert tone="info" title="La regla de arbitraje">
            Unánime → arbitra. Mayoría 2-vs-1 → arbitra solo si la confianza media de la etiqueta
            ganadora ≥ {THRESHOLD}; si no, escala. Empate → escala. La confianza es la señal que
            distingue un acuerdo real de uno frágil, y el escalado a humano es exactamente donde se
            paga el coste de no saber.
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
