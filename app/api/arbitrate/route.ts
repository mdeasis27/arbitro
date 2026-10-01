import { NextResponse } from "next/server";
import { getSql } from "@/lib/db/client";
import { arbitrate } from "@/lib/arbitro/arbitrate";
import type { ModelOutput } from "@/lib/arbitro/types";

function parseOutput(v: unknown): ModelOutput | null {
  if (typeof v !== "object" || v === null) return null;
  const o = v as { label?: unknown; confidence?: unknown };
  if (typeof o.label !== "string" || o.label.length === 0) return null;
  if (typeof o.confidence !== "number" || !Number.isFinite(o.confidence)) return null;
  return { label: o.label, confidence: o.confidence };
}

export async function POST(request: Request) {
  let body: { a?: unknown; b?: unknown; c?: unknown; threshold?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const threshold =
    typeof body.threshold === "number" && Number.isFinite(body.threshold) ? body.threshold : 0.6;

  const a = parseOutput(body.a);
  const b = parseOutput(body.b);
  const c = parseOutput(body.c);

  if (!a || !b || !c) {
    return NextResponse.json(
      { error: "Cada modelo requiere { label, confidence }" },
      { status: 400 },
    );
  }

  try {
    const verdict = arbitrate({ id: "live", gold: "", a, b, c }, threshold);

    const db = getSql();
    await db`INSERT INTO arbitro.verdicts (a_label, b_label, c_label, confidence, threshold, outcome, label) VALUES (${a.label}, ${b.label}, ${c.label}, ${verdict.confidence}, ${threshold}, ${verdict.outcome}, ${verdict.label})`;

    return NextResponse.json(verdict);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error ejecutando el arbitraje" },
      { status: 500 },
    );
  }
}
