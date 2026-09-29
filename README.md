# Arbitro

**LLM output arbitration** — three models vote, a deterministic arbitrator picks a winner or
escalates to a human when there is no clear consensus.

> **Result:** the three models agree **66.7%** of the time (mean pairwise agreement). The
> arbitrator resolves **18 of 22** cases with **88.9%** accuracy (16/18), and **escalates the
> other 18.2%** to a human — the thin majorities and 3-way splits where a confident guess would
> be a liability. The two arbitrated errors are exactly the cases where a *confident* majority
> outvoted the correct minority.

---

## Result

| Metric | Value |
|---|---|
| Pairwise agreement (a·b·c) | **66.7%** |
| Arbitrated | 18 / 22 |
| Arbitration accuracy | **88.9%** (16 / 18) |
| Escalated to human | **18.2%** (4 / 22) |

The escalation set is not random: it is precisely the 2 thin majorities (winning label at 0.55
confidence, below the 0.6 threshold) and the 2 three-way splits. The arbitrated errors (c21,
c22) are the honest limit of majority voting — two models agree, both are wrong, and the
arbitrator has no signal that overrules them.

---

## Architecture

```
lib/arbitro/                # canonical core (TypeScript, tested)
  agreement.ts              #   pairwise agreement · vote tally · mean confidence
  arbitrate.ts              #   the arbitration rule (unanimous / majority / escalate)
  benchmark.ts              #   agreement · escalation rate · arbitration accuracy
  demo.ts                   #   wires cases into every number
  data/                     #   cases.json (committed model verdicts + gold)
  fixtures/                 #   benchmark.json (pinned metrics)
backend/                    # same math in Python + pytest (authoritative)
  src/arbitro/              #   agreement.py · arbitrate.py · benchmark.py
  tests/                    #   pinned to tests/fixtures/{cases,benchmark}.json
app/                        # Next.js landing + demo dashboard (Vercel, demo mode)
```

The three "models" are committed, deterministic verdicts (a documented proxy for real model
calls); the arbitration rule is the real, shared logic. Both languages reproduce the pinned
agreement / escalation / accuracy numbers to ~1e-10.

## Design decisions & tradeoffs

1. **Majority vote with a confidence threshold.** Plain majority would arbitrate every 2-vs-1
   case; the confidence threshold makes a *thin* majority escalate instead. The cost is a bit
   more human load; the benefit is not shipping a guess dressed as a decision.
2. **Pairwise agreement, not Fleiss' kappa.** Pairwise is simpler to interpret and still honest
   about model concordance. Production would report kappa (chance-corrected) — noted as an
   upgrade, not hidden.
3. **Escalation is a feature, not a failure.** Routing ambiguous cases to a human is exactly
   where the arbitration system earns its keep; the metric exposes it rather than burying it.

## What did not work

- **A confident majority is undetectable by the arbitrator.** c21/c22 show two models agreeing
  on the wrong label with high confidence; majority voting structurally cannot catch that
  without an independent correctness signal (e.g., the gold, or a stronger referee model).
- **The synthetic verdicts are clean.** Real models correlate (shared training), so true
  agreement is higher than the demo's spread suggests — the demo isolates the *rule* rather
  than the real-world correlation.

## Run it

```bash
# frontend demo + TS tests
pnpm install && pnpm dev      # http://localhost:3000
pnpm test                     # 11 vitest tests

# backend (authoritative math) — Python 3.12+
cd backend && uv sync --extra dev && uv run pytest   # 4 tests, pinned fixtures
```

## Stack

Next.js 16 · TypeScript · Vitest · Tailwind v4 · Python 3.13 · pytest
