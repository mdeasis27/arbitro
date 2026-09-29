import { describe, expect, it } from "vitest";

import { pairwiseAgreement, tally } from "./agreement";
import { arbitrate } from "./arbitrate";
import type { Case } from "./types";

const UNANIMOUS: Case = {
  id: "x",
  gold: "approve",
  a: { label: "approve", confidence: 0.9 },
  b: { label: "approve", confidence: 0.9 },
  c: { label: "approve", confidence: 0.9 },
};

const THIN: Case = {
  id: "x",
  gold: "approve",
  a: { label: "approve", confidence: 0.55 },
  b: { label: "approve", confidence: 0.54 },
  c: { label: "deny", confidence: 0.8 },
};

const SPLIT: Case = {
  id: "x",
  gold: "approve",
  a: { label: "approve", confidence: 0.6 },
  b: { label: "deny", confidence: 0.6 },
  c: { label: "review", confidence: 0.6 },
};

describe("tally", () => {
  it("counts votes per label", () => {
    const t = tally(UNANIMOUS);
    expect(t.get("approve")).toBe(3);
  });

  it("counts a 2-vs-1 split", () => {
    const t = tally(THIN);
    expect(t.get("approve")).toBe(2);
    expect(t.get("deny")).toBe(1);
  });
});

describe("pairwiseAgreement", () => {
  it("is 1.0 for unanimous cases", () => {
    expect(pairwiseAgreement([UNANIMOUS])).toBeCloseTo(1, 12);
  });

  it("is 0.0 for a 3-way split", () => {
    expect(pairwiseAgreement([SPLIT])).toBeCloseTo(0, 12);
  });
});

describe("arbitrate", () => {
  it("arbitrates a unanimous verdict", () => {
    const v = arbitrate(UNANIMOUS, 0.6);
    expect(v.outcome).toBe("arbitrated");
    expect(v.label).toBe("approve");
  });

  it("arbitrates a confident majority", () => {
    const v = arbitrate({ ...THIN, a: { label: "approve", confidence: 0.85 }, b: { label: "approve", confidence: 0.84 } }, 0.6);
    expect(v.outcome).toBe("arbitrated");
  });

  it("escalates a thin majority", () => {
    const v = arbitrate(THIN, 0.6);
    expect(v.outcome).toBe("escalated");
    expect(v.label).toBeNull();
  });

  it("escalates a 3-way split", () => {
    const v = arbitrate(SPLIT, 0.6);
    expect(v.outcome).toBe("escalated");
  });
});
