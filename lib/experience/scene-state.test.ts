import { expect, it } from "vitest";
import { tapeCounts } from "@/design-system/demo/outcome-tape";
import { arbitroCells, revealedPlays } from "./scene-state";
import { runMission } from "./mission";

it("hides the plays not revealed yet", () => {
  expect(arbitroCells([{ id: "a", status: "served" }, { id: "b", status: "lost" }], 1)).toEqual(["served", "pending"]);
});

it("final tape counts equal the mission totals", async () => {
  const { result } = await runMission({ threshold: .6 }, new AbortController().signal, () => {});
  expect(tapeCounts(arbitroCells(result.items, result.items.length))).toEqual({ served: 22 - result.reviewed - result.wrong, rerouted: result.reviewed, lost: result.wrong, pending: 0 });
});

it("reveals in proportion to playback, all of it when complete or under reduced motion", () => {
  expect(revealedPlays({ visible: 1, total: 4, complete: false }, 22, false)).toBe(6);
  expect(revealedPlays({ visible: 4, total: 4, complete: true }, 22, false)).toBe(22);
  expect(revealedPlays({ visible: 1, total: 4, complete: false }, 22, true)).toBe(22);
  expect(revealedPlays({ visible: 0, total: 0, complete: false }, 22, false)).toBe(22);
});
