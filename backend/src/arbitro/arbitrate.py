"""Arbitration rule — mirrors lib/arbitro/arbitrate.ts."""

from __future__ import annotations

from .agreement import mean_confidence, tally


def arbitrate(c: dict, threshold: float) -> dict:
    votes = tally(c)
    label, count = sorted(votes.items(), key=lambda kv: kv[1], reverse=True)[0]

    if count == 3:
        return {"outcome": "arbitrated", "label": label, "votes": count, "confidence": mean_confidence(c, label)}

    if count == 2:
        confidence = mean_confidence(c, label)
        if confidence >= threshold:
            return {"outcome": "arbitrated", "label": label, "votes": count, "confidence": confidence}
        return {"outcome": "escalated", "label": None, "votes": count, "confidence": confidence}

    return {"outcome": "escalated", "label": None, "votes": count, "confidence": mean_confidence(c, label)}
