import { describe, expect, it } from "vitest";
import { STORY } from "./story";
import { lintStory, storyStrings as strings } from "@/design-system/demo/copy-lint";

describe("Arbitro story copy", () => {
  it("has the same shape in English and Spanish", () => {
    const keys = (o: unknown): string[] => o && typeof o === "object" && !Array.isArray(o) ? Object.entries(o).filter(([k]) => k !== "before" && k !== "after").flatMap(([k, v]) => [k, ...keys(v).map(x => `${k}.${x}`)]) : [];
    expect(keys(STORY.es)).toEqual(keys(STORY.en));
    expect(STORY.es.analogy.dictionary).toHaveLength(STORY.en.analogy.dictionary.length);
  });

  it("has no empty strings except the owner-supplied why note", () => {
    for (const locale of ["en", "es"] as const) {
      const { why, ...rest } = STORY[locale];
      expect(why.title.trim()).not.toBe("");
      for (const s of strings(rest)) expect(s.trim(), `${locale}: empty string`).not.toBe("");
    }
  });

  it("avoids AI-sounding patterns and brand names", () => {
    for (const locale of ["en", "es"] as const) expect(lintStory(STORY[locale]), locale).toEqual([]);
  });

  it("states the comparison truthfully at a gap, one, a tie and the reverse case", () => {
    expect(STORY.es.compare.sentence(2, 4)).toBe("Con árbitro, 2 marcaciones equivocadas. Sin él, 4.");
    expect(STORY.es.compare.sentence(1, 4)).toContain("1 marcación equivocada.");
    expect(STORY.en.compare.sentence(4, 4)).toBe("Both ways ended with 4 wrong calls.");
    expect(STORY.en.compare.sentence(5, 4)).toContain("the referee did worse");
  });

  it("asks the bet about the confidence the visitor chose and states the graded quantity", () => {
    expect(STORY.en.tryIt.question(.6)).toContain("need 60% confidence");
    expect(STORY.es.tryIt.question(.83)).toContain("necesitan 83% de confianza");
    expect([0, 1, 4].map(STORY.en.compare.verdict)).toEqual(["The referee reviewed no plays", "The referee reviewed 1 play", "The referee reviewed 4 plays"]);
    expect(STORY.es.scene.reviewedOf(1, 22)).toBe("Jugadas revisadas: 1 de 22");
  });
});
