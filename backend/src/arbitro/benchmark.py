"""Benchmark — mirrors lib/arbitro/benchmark.ts."""

from __future__ import annotations

from .agreement import pairwise_agreement
from .arbitrate import arbitrate


def _rate(a: int, b: int) -> float:
    return 0.0 if b == 0 else a / b


def benchmark(cases: list[dict], threshold: float) -> dict:
    agreement = pairwise_agreement(cases)
    arbitrated = 0
    arbitrated_correct = 0
    escalated = 0

    for c in cases:
        v = arbitrate(c, threshold)
        if v["outcome"] == "escalated":
            escalated += 1
        else:
            arbitrated += 1
            if v["label"] == c["gold"]:
                arbitrated_correct += 1

    return {
        "agreement": agreement,
        "escalationRate": _rate(escalated, len(cases)),
        "arbitrated": arbitrated,
        "arbitratedCorrect": arbitrated_correct,
        "arbitrationAccuracy": _rate(arbitrated_correct, arbitrated),
        "n": len(cases),
    }
