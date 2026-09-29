import json
from pathlib import Path

import pytest

from arbitro.agreement import pairwise_agreement, tally
from arbitro.arbitrate import arbitrate
from arbitro.benchmark import benchmark

FIXTURES = Path(__file__).parent / "fixtures"


def _load(name: str):
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


def _cases():
    return _load("cases.json")["cases"]


def _threshold():
    return _load("cases.json")["threshold"]


def test_tally_counts_votes():
    c = {"id": "x", "gold": "approve",
         "a": {"label": "approve", "confidence": 0.9},
         "b": {"label": "approve", "confidence": 0.9},
         "c": {"label": "deny", "confidence": 0.9}}
    t = tally(c)
    assert t == {"approve": 2, "deny": 1}


def test_arbitrate_outcomes():
    unanimous = {"id": "x", "gold": "approve",
                 "a": {"label": "approve", "confidence": 0.9},
                 "b": {"label": "approve", "confidence": 0.9},
                 "c": {"label": "approve", "confidence": 0.9}}
    thin = {"id": "x", "gold": "approve",
            "a": {"label": "approve", "confidence": 0.55},
            "b": {"label": "approve", "confidence": 0.54},
            "c": {"label": "deny", "confidence": 0.8}}
    split = {"id": "x", "gold": "approve",
             "a": {"label": "approve", "confidence": 0.6},
             "b": {"label": "deny", "confidence": 0.6},
             "c": {"label": "review", "confidence": 0.6}}

    assert arbitrate(unanimous, 0.6)["outcome"] == "arbitrated"
    assert arbitrate(thin, 0.6)["outcome"] == "escalated"
    assert arbitrate(split, 0.6)["outcome"] == "escalated"


def test_benchmark_matches_fixture():
    cases = _cases()
    fixture = _load("benchmark.json")

    result = benchmark(cases, _threshold())
    assert result["n"] == fixture["n"]
    assert result["agreement"] == pytest.approx(fixture["agreement"], abs=1e-10)
    assert result["escalationRate"] == pytest.approx(fixture["escalationRate"], abs=1e-10)
    assert result["arbitrated"] == fixture["arbitrated"]
    assert result["arbitratedCorrect"] == fixture["arbitratedCorrect"]
    assert result["arbitrationAccuracy"] == pytest.approx(fixture["arbitrationAccuracy"], abs=1e-10)


def test_pairwise_agreement_extremes():
    unanimous = {"id": "x", "gold": "a",
                 "a": {"label": "a", "confidence": 0.9},
                 "b": {"label": "a", "confidence": 0.9},
                 "c": {"label": "a", "confidence": 0.9}}
    split = {"id": "x", "gold": "a",
             "a": {"label": "a", "confidence": 0.9},
             "b": {"label": "b", "confidence": 0.9},
             "c": {"label": "c", "confidence": 0.9}}
    assert pairwise_agreement([unanimous]) == pytest.approx(1.0, abs=1e-12)
    assert pairwise_agreement([split]) == pytest.approx(0.0, abs=1e-12)
