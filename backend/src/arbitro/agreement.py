"""Agreement — mirrors lib/arbitro/agreement.py."""

from __future__ import annotations

MODELS = ["a", "b", "c"]


def pairwise_agreement(cases: list[dict]) -> float:
    pairs = [(MODELS[0], MODELS[1]), (MODELS[0], MODELS[2]), (MODELS[1], MODELS[2])]
    agreements = []
    for x, y in pairs:
        agreed = sum(1 for c in cases if c[x]["label"] == c[y]["label"])
        agreements.append(agreed / len(cases))
    return sum(agreements) / len(agreements)


def tally(c: dict) -> dict[str, int]:
    votes: dict[str, int] = {}
    for m in MODELS:
        label = c[m]["label"]
        votes[label] = votes.get(label, 0) + 1
    return votes


def mean_confidence(c: dict, label: str) -> float:
    members = [m for m in MODELS if c[m]["label"] == label]
    return sum(c[m]["confidence"] for m in members) / len(members)
