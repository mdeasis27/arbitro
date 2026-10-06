import { expect, it } from "vitest";
import { runMission, judgeCases, pluralityWrong } from "./mission";
import { traceCopy } from "./trace-copy";

const counts = (t: number) => {
  const items = judgeCases(t);
  return { served: items.filter(i => i.status === "served").length, rerouted: items.filter(i => i.status === "rerouted").length, lost: items.filter(i => i.status === "lost").length };
};

it("judges the 22 committed cases at the default 60%: 16 settled right, 4 reviewed, 2 wrong", () => {
  expect(counts(.6)).toEqual({ served: 16, rerouted: 4, lost: 2 });
  expect(judgeCases(.6).map(i => i.status[0]).join("")).toBe("ssssssssssssssssrrrrll");
});

it("flips the bet (at most 4 reviews) between 82% and 83%", () => {
  expect(counts(.82).rerouted).toBe(4);
  expect(counts(.83).rerouted).toBe(5);
});

it("sweep: both bet answers are reachable on the slider, and the default says yes", () => {
  const answers = new Set<boolean>();
  for (let t = 50; t <= 95; t++) answers.add(counts(t / 100).rerouted <= 4);
  expect([...answers].sort()).toEqual([false, true]);
  expect(counts(.6).rerouted <= 4).toBe(true);
});

it("without the video referee the plurality decides everything and gets 4 wrong", () => {
  expect(pluralityWrong()).toBe(4);
});

it("runs the mission, reveals the cases one by one and stops when cancelled", async () => {
  const events: string[] = [];
  const run = await runMission({ threshold: .6 }, new AbortController().signal, e => events.push(e.id));
  expect(run.result.items).toHaveLength(22);
  expect(run.result.comparison).toEqual({ mine: 2, without: 4 });
  expect(run.trace.length).toBeGreaterThan(2);
  expect(events).toEqual(run.trace.map(e => e.id));
  const ctl = new AbortController(); ctl.abort();
  await expect(runMission({ threshold: .6 }, ctl.signal, () => {})).rejects.toThrow();
});

it("carries each play's three votes, the right call and the majority confidence the scene animates", () => {
  const items = judgeCases(.6);
  expect(items[0]).toMatchObject({ id: "c01", gold: "approve", majority: "approve", count: 3, votes: [{ label: "approve", confidence: .91 }, { label: "approve", confidence: .88 }, { label: "approve", confidence: .86 }] });
  expect(items[16]).toMatchObject({ status: "rerouted", gold: "approve", majority: "approve", count: 2 });
  expect(items[16].confidence).toBeCloseTo(.55, 6);
  expect(items[20]).toMatchObject({ status: "lost", gold: "deny", majority: "approve", count: 2 });
  expect(items[20].confidence).toBeCloseTo(.89, 6);
});

it("plays one trace event per play, so the player's speed and Show all drive the scene", async () => {
  const run = await runMission({ threshold: .6 }, new AbortController().signal, () => {});
  expect(run.trace).toHaveLength(22);
  expect(run.trace.map(e => e.evidenceIds)).toEqual(run.result.items.map(i => [i.id]));
  expect(run.trace.map(e => e.messageKey)).toEqual(run.result.items.map(i => `play.${i.status}`));
  for (const key of new Set(run.trace.map(e => e.messageKey))) for (const l of ["en", "es"] as const) expect(traceCopy(l, key)).not.toBe(key);
});
