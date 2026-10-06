import { expect, it } from "vitest";
import { runMission, judgeCases, pluralityWrong } from "./mission";

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

it("runs the mission, reveals the cases in groups and stops when cancelled", async () => {
  const events: string[] = [];
  const run = await runMission({ threshold: .6 }, new AbortController().signal, e => events.push(e.id));
  expect(run.result.items).toHaveLength(22);
  expect(run.result.comparison).toEqual({ mine: 2, without: 4 });
  expect(run.trace.length).toBeGreaterThan(2);
  expect(events).toEqual(run.trace.map(e => e.id));
  const ctl = new AbortController(); ctl.abort();
  await expect(runMission({ threshold: .6 }, ctl.signal, () => {})).rejects.toThrow();
});
