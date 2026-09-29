import { describe, expect, it } from "vitest";

import casesRaw from "./data/cases.json";
import fixture from "./fixtures/benchmark.json";
import { benchmark } from "./benchmark";
import { arbitrate } from "./arbitrate";
import type { Case } from "./types";

const CASES = casesRaw.cases as unknown as Case[];
const THRESHOLD = casesRaw.threshold as number;

describe("pinned fixture: benchmark", () => {
  it("reproduces agreement, escalation and arbitration accuracy", () => {
    const result = benchmark(CASES, THRESHOLD);

    expect(result.n).toBe(fixture.n);
    expect(result.agreement).toBeCloseTo(fixture.agreement, 10);
    expect(result.escalationRate).toBeCloseTo(fixture.escalationRate, 10);
    expect(result.arbitrated).toBe(fixture.arbitrated);
    expect(result.arbitratedCorrect).toBe(fixture.arbitratedCorrect);
    expect(result.arbitrationAccuracy).toBeCloseTo(fixture.arbitrationAccuracy, 10);
  });
});

describe("arbitration outcomes", () => {
  it("escalates exactly the ambiguous cases (thin majority + 3-way split)", () => {
    const escalated = CASES.filter((c) => arbitrate(c, THRESHOLD).outcome === "escalated");
    expect(escalated.map((c) => c.id)).toEqual(["c17", "c18", "c19", "c20"]);
  });

  it("is wrong only when a confident majority overrules the correct minority", () => {
    const wrong = CASES.filter((c) => {
      const v = arbitrate(c, THRESHOLD);
      return v.outcome === "arbitrated" && v.label !== c.gold;
    });
    expect(wrong.map((c) => c.id)).toEqual(["c21", "c22"]);
  });
});
